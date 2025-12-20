import { useMemo, useState } from 'react';
import UserStats from '../../components/UserStats/UserStats';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import ActivityBoxList from '../../components/ActivityBoxList/ActivityBoxList';
import ContributionList from '../../components/ContributionList/ContributionList';
import styles from './Profile.module.css';
import { useAuth } from '../../context/AuthContext.jsx';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';
import { api, resourceData, ensureAbsoluteUrl } from '../../services/apiClient.js';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Profile() {
  const { user, token, updateUserLocal } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('contributions');
  const [activeSubTab, setActiveSubTab] = useState('following');
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ['fantasy', 'adventure', 'collaboration'];

  const stories = [];
  const contributions = [];
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoadingRelations, setIsLoadingRelations] = useState(false);
  const [relationsError, setRelationsError] = useState(null);
  const [discover, setDiscover] = useState([]);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [activity, setActivity] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const [networkActivity, setNetworkActivity] = useState([]);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [networkFilter, setNetworkFilter] = useState('followers'); // followers | following
  const isNetworkOnly = false;

  const formatRelative = (value) => {
    if (!value) return 'recently';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'recently';
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  const fetchRelations = async () => {
    if (!token || !user?.id) return;
    setIsLoadingRelations(true);
    setRelationsError(null);
    try {
      const [foll, wing] = await Promise.all([
        api.followers(token, user.id),
        api.following(token, user.id),
      ]);
      setFollowers(resourceData(foll));
      setFollowing(resourceData(wing));
    } catch (e) {
      setRelationsError('Unable to load relations.');
    } finally {
      setIsLoadingRelations(false);
    }
  };

  useEffect(() => {
    fetchRelations();
    fetchActivityFeed();
    fetchFavorites();
    const favHandler = () => {
      fetchFavorites();
      fetchActivityFeed();
    };
    window.addEventListener('favorites:update', favHandler);
    return () => window.removeEventListener('favorites:update', favHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (!tab) return;
    const allowed = ['contributions', 'favs', 'activity', 'relations', 'network'];
    if (allowed.includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const fetchDiscover = async (query = '') => {
    if (!token) return;
    setIsLoadingDiscover(true);
    try {
      const res = await api.users(token, query);
      const list = resourceData(res).filter((u) => u.id !== user?.id);
      setDiscover(list);
    } catch (e) {
      // ignore
    } finally {
      setIsLoadingDiscover(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      fetchDiscover(discoverQuery);
    }, 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverQuery, token, user?.id]);

  useEffect(() => {
    fetchNetworkActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followers, following, networkFilter]);

  const handleFollow = async (targetId) => {
    if (!token) {
      alert('Please log in to follow users.');
      return;
    }
    try {
      await api.followUser(token, targetId);
      fetchRelations();
      updateUserLocal({
        ...user,
        following_count: (user?.following_count ?? 0) + 1,
      });
    } catch (_e) {
      alert('Unable to follow this user.');
    }
  };

  const handleUnfollow = async (targetId) => {
    if (!token) return;
    try {
      await api.unfollowUser(token, targetId);
      fetchRelations();
      updateUserLocal({
        ...user,
        following_count: Math.max(0, (user?.following_count ?? 1) - 1),
      });
    } catch (_e) {
      alert('Unable to unfollow this user.');
    }
  };

  const isFollowingUser = (id) => following?.some((f) => f.id === id);

  const mapStories = (list) =>
    list.map((story) => ({
      storyId: story.id,
      src: ensureAbsoluteUrl(story.cover_image_url) || coverPlaceholder,
      alt: 'cover',
      title: story.title,
      desc: story.synopsis || 'A collaborative story.',
      tags: story.tags || tag_list,
      authors: [(story.owner?.avatar_url && ensureAbsoluteUrl(story.owner.avatar_url)) || avatarPlaceholder],
      segments: story.segments_count ?? story.metrics?.segments ?? '—',
      views: story.reading_count ?? story.reads_count ?? story.metrics?.reads ?? '—',
      comments: story.comments_count ?? story.metrics?.comments ?? '—',
      rating: story.rating_average ?? story.rating?.average ?? '—',
      updated: story.updated_at ?? story.published_at ?? story.created_at ?? '—',
      favorited: story.favorites_count ?? story.metrics?.favorites ?? '—',
      bookmarked: '—',
    }));

  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    setIsLoadingFavorites(true);
    setFavoritesError(null);
    try {
      const res = await api.favorites(token);
      const data = resourceData(res) || [];
      setFavorites(mapStories(data));
    } catch (e) {
      setFavoritesError(e?.message || 'Unable to load favorites.');
      setFavorites([]);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const fetchActivityFeed = async () => {
    if (!user?.id) return;
    setIsLoadingActivity(true);
    setActivityError(null);
    try {
      const ownStoriesRes = await api.stories({ owner: user.id, per_page: 5 });
      const ownStories = resourceData(ownStoriesRes) || [];

      let favorites = [];
      if (token) {
        try {
          const favsRes = await api.favorites(token);
          favorites = resourceData(favsRes) || [];
        } catch (_e) {
          favorites = [];
        }
      }

      const events = [];
      ownStories.forEach((story) => {
        events.push({
          src: story.cover_image_url || coverPlaceholder,
          username: user.display_name || user.username || 'You',
          desc: `published “${story.title}”`,
          timestamp: story.updated_at || story.created_at,
          updated: formatRelative(story.updated_at || story.created_at),
        });
      });
      favorites.forEach((story) => {
        events.push({
          src: story.cover_image_url || coverPlaceholder,
          username: user.display_name || user.username || 'You',
          desc: `favorited “${story.title}”`,
          timestamp: story.updated_at || story.created_at,
          updated: formatRelative(story.updated_at || story.created_at),
        });
      });

      events.sort((a, b) => {
        const da = new Date(a.timestamp || 0).getTime();
        const db = new Date(b.timestamp || 0).getTime();
        return db - da;
      });

      setActivity(events);
    } catch (e) {
      setActivityError(e?.message || 'Unable to load activity.');
      setActivity([]);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const fetchNetworkActivity = async () => {
    const pool = networkFilter === 'followers' ? followers : following;
    const ids = [...new Set(pool.map((u) => u.id))];
    if (!ids.length) {
      setNetworkActivity([]);
      return;
    }

    setIsLoadingNetwork(true);
    setNetworkError(null);
    const userMap = new Map(pool.map((u) => [u.id, u]));
    try {
      const results = await Promise.all(ids.map((id) => api.stories({ owner: id, per_page: 3, sort: 'recent' })));
      const events = [];
      results.forEach((res, idx) => {
        const stories = resourceData(res) || [];
        const rel = userMap.get(ids[idx]);
        const name = rel?.display_name || rel?.username || 'User';
        const avatar = ensureAbsoluteUrl(rel?.avatar_url) || avatarPlaceholder;
        stories.forEach((story) => {
          const timestamp = story.updated_at || story.created_at;
          events.push({
            src: ensureAbsoluteUrl(story.cover_image_url) || avatar,
            username: name,
            desc: `updated “${story.title}”`,
            updated: formatRelative(timestamp),
          });
        });
      });
      events.sort((a, b) => {
        const da = new Date(a.updated || 0).getTime();
        const db = new Date(b.updated || 0).getTime();
        return db - da;
      });
      setNetworkActivity(events.slice(0, 12));
    } catch (e) {
      setNetworkError(e?.message || 'Unable to load network activity.');
      setNetworkActivity([]);
    } finally {
      setIsLoadingNetwork(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.avatar}>{user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h2>{user?.display_name || user?.username}</h2>
            <p className={styles.bio}>{user?.bio || 'Add your bio in settings.'}</p>
          </div>
        </div>
        <div className="grid-4 stats">
          <UserStats src={avatarPlaceholder} alt="image" number={user?.stories_count ?? 0} desc="Stories" />
          <UserStats src={avatarPlaceholder} alt="image" number={user?.followers_count ?? 0} desc="Followers" />
          <UserStats src={avatarPlaceholder} alt="image" number={user?.following_count ?? 0} desc="Following" />
          <UserStats src={avatarPlaceholder} alt="image" number={user?.segments_count ?? 0} desc="Segments" />
        </div>
        <div className={styles.tags}>
          <span className="pill">Storyteller</span>
          <span className="pill">Collaborator</span>
        </div>
      </section>

      <nav className={styles.tabs}>
        <button className={activeTab === 'contributions' ? styles.active : styles.tab} onClick={() => setActiveTab('contributions')}>
          Contributions
        </button>
        <button className={activeTab === 'favs' ? styles.active : styles.tab} onClick={() => setActiveTab('favs')}>
          Favorites
        </button>
        <button className={activeTab === 'activity' ? styles.active : styles.tab} onClick={() => setActiveTab('activity')}>
          Activity
        </button>
        <button className={activeTab === 'network' ? styles.active : styles.tab} onClick={() => setActiveTab('network')}>
          Network Activity
        </button>
        <button className={activeTab === 'relations' ? styles.active : styles.tab} onClick={() => setActiveTab('relations')}>
          Relations
        </button>
      </nav>

      <div className={styles.panel}>
        {activeTab === 'contributions' && <ContributionList contributions={contributions} />}
        {activeTab === 'favs' && (
          <>
            {favoritesError && <div style={{ color: 'red' }}>{favoritesError}</div>}
            {isLoadingFavorites && <div>Loading favorites...</div>}
            {!isLoadingFavorites && (
              <StoryThumbnailList
                stories={favorites}
              />
            )}
            {!isLoadingFavorites && !favorites.length && <p style={{ color: 'var(--muted)' }}>No favorites yet.</p>}
          </>
        )}
        {activeTab === 'activity' && (
          <>
            {activityError && <div style={{ color: 'red' }}>{activityError}</div>}
            {isLoadingActivity && <div>Loading activity...</div>}
            {!isLoadingActivity && <ActivityBoxList activity={activity} />}
          </>
        )}
        {activeTab === 'network' && (
          <>
            {networkError && <div style={{ color: 'red' }}>{networkError}</div>}
            <div className={styles.networkFilters}>
              <button
                className={networkFilter === 'followers' ? styles.active : styles.tab}
                onClick={() => setNetworkFilter('followers')}
              >
                Followers
              </button>
              <button
                className={networkFilter === 'following' ? styles.active : styles.tab}
                onClick={() => setNetworkFilter('following')}
              >
                Following
              </button>
            </div>
            {isLoadingNetwork && <div>Loading network activity...</div>}
            {!isLoadingNetwork && <ActivityBoxList activity={networkActivity} />}
            {!isLoadingNetwork && !networkActivity.length && (
              <p style={{ color: 'var(--muted)' }}>No activity yet.</p>
            )}
          </>
        )}
        {activeTab === 'relations' && (
          <div>
            <div className={styles.relationsNav}>
              <button className={activeSubTab === 'following' ? styles.active : styles.tab} onClick={() => setActiveSubTab('following')}>
                Following
              </button>
              <button className={activeSubTab === 'followers' ? styles.active : styles.tab} onClick={() => setActiveSubTab('followers')}>
                Followers
              </button>
              <button className={activeSubTab === 'discover' ? styles.active : styles.tab} onClick={() => setActiveSubTab('discover')}>
                Discover
              </button>
            </div>
            {relationsError && <div style={{ color: 'red' }}>{relationsError}</div>}
            {isLoadingRelations && <div className={styles.relationRow}>Loading...</div>}
            {!isLoadingRelations && activeSubTab === 'following' && following.map((rel) => (
              <div key={rel.id} className={styles.relationRow}>
                <div className={styles.relationInfo}>
                  <img src={rel.avatar_url || avatarPlaceholder} alt={rel.username} className={styles.relationAvatar} />
                  <div>
                    <div className={styles.relationName}>{rel.display_name || rel.username}</div>
                    <div className={styles.relationMeta}>{rel.followers_count ?? 0} followers</div>
                  </div>
                </div>
                <button className="btn ghost" onClick={() => handleUnfollow(rel.id)}>Unfollow</button>
              </div>
            ))}
            {!isLoadingRelations && activeSubTab === 'followers' && followers.map((rel) => (
              <div key={rel.id} className={styles.relationRow}>
                <div className={styles.relationInfo}>
                  <img src={rel.avatar_url || avatarPlaceholder} alt={rel.username} className={styles.relationAvatar} />
                  <div>
                    <div className={styles.relationName}>{rel.display_name || rel.username}</div>
                    <div className={styles.relationMeta}>{rel.followers_count ?? 0} followers</div>
                  </div>
                </div>
                {isFollowingUser(rel.id) ? (
                  <button className="btn ghost" onClick={() => handleUnfollow(rel.id)}>Unfollow</button>
                ) : (
                  <button className="btn primary" onClick={() => handleFollow(rel.id)}>Follow back</button>
                )}
              </div>
            ))}
            {!isLoadingDiscover && activeSubTab === 'discover' && (
              <div className={styles.discover}>
                <div className={styles.discoverSearch}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={discoverQuery}
                    onChange={(e) => setDiscoverQuery(e.target.value)}
                  />
                </div>
                {discover.map((rel) => (
                  <div key={rel.id} className={styles.relationRow}>
                    <div className={styles.relationInfo}>
                      <img src={rel.avatar_url || avatarPlaceholder} alt={rel.username} className={styles.relationAvatar} />
                      <div>
                        <div className={styles.relationName}>{rel.display_name || rel.username}</div>
                        <div className={styles.relationMeta}>{rel.followers_count ?? 0} followers</div>
                      </div>
                    </div>
                    {isFollowingUser(rel.id) ? (
                      <button className="btn ghost" onClick={() => handleUnfollow(rel.id)}>Unfollow</button>
                    ) : (
                      <button className="btn primary" onClick={() => handleFollow(rel.id)}>Follow</button>
                    )}
                  </div>
                ))}
                {!isLoadingDiscover && discover.length === 0 && (
                  <p style={{ color: 'var(--muted)' }}>No users found.</p>
                )}
              </div>
            )}
            {!isLoadingRelations && activeSubTab === 'following' && following.length === 0 && (
              <p style={{ color: 'var(--muted)' }}>You are not following anyone yet.</p>
            )}
            {!isLoadingRelations && activeSubTab === 'followers' && followers.length === 0 && (
              <p style={{ color: 'var(--muted)' }}>No followers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

import { useMemo, useState } from "react";
import UserStats from "../../components/UserStats/UserStats.jsx";
import StoryThumbnailList from "../../components/StoryThumbnailList/StoryThumbnailList.jsx";
import ActivityBoxList from "../../components/ActivityBoxList/ActivityBoxList.jsx";
import ContributionList from "../../components/ContributionList/ContributionList.jsx";
import styles from "./Profile.module.css";
import coverPlaceholder from "../../assets/cover.svg";
import avatarPlaceholder from "../../assets/avatar.svg";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../../context/I18nContext.jsx";

function Profile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("contributions");
  const [activeSubTab, setActiveSubTab] = useState("followers");
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ["fantasy", "adventure", "collaboration"];
  const { t } = useI18n();

  const stories = [];
  const contributions = [];
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoadingRelations, setIsLoadingRelations] = useState(false);
  const [relationsError, setRelationsError] = useState(null);
  const [discover, setDiscover] = useState([]);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [activity, setActivity] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const [networkActivity, setNetworkActivity] = useState([]);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
  const [networkError, setNetworkError] = useState(null);
  const [networkFilter, setNetworkFilter] = useState("followers"); // followers | following
  const isNetworkOnly = false;

  const formatRelative = (value) => {
    if (!value) return "recently";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "recently";
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (!tab) return;
    const allowed = [
      "contributions",
      "favs",
      "activity",
      "relations",
      "network",
    ];
    if (allowed.includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const isFollowingUser = (id) => following?.some((f) => f.id === id);

  const mapStories = (list) =>
    list.map((story) => ({
      storyId: story.id,
      src: ensureAbsoluteUrl(story.cover_image_url) || coverPlaceholder,
      alt: "cover",
      title: story.title,
      desc: story.synopsis || "A collaborative story.",
      tags: story.tags || tag_list,
      authors: [
        (story.owner?.avatar_url &&
          ensureAbsoluteUrl(story.owner.avatar_url)) ||
          avatarPlaceholder,
      ],
      segments: story.segments_count ?? story.metrics?.segments ?? "—",
      views:
        story.reading_count ?? story.reads_count ?? story.metrics?.reads ?? "—",
      comments: story.comments_count ?? story.metrics?.comments ?? "—",
      rating: story.rating_average ?? story.rating?.average ?? "—",
      updated:
        story.updated_at ?? story.published_at ?? story.created_at ?? "—",
      favorited: story.favorites_count ?? story.metrics?.favorites ?? "—",
      bookmarked: "—",
    }));

  return (
    <div className={styles.page}>
      <section className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.avatar}>{"U"}</div>
          <div>
            <h2>{"User"}</h2>
            <p className={styles.bio}>{t("profile.addBio")}</p>
          </div>
        </div>
        <div className="grid-4 stats">
          <UserStats
            src={avatarPlaceholder}
            alt="image"
            number={0}
            desc={t("stats.stories")}
          />
          <UserStats
            src={avatarPlaceholder}
            alt="image"
            number={0}
            desc={t("stats.followers")}
          />
          <UserStats
            src={avatarPlaceholder}
            alt="image"
            number={0}
            desc={t("stats.following")}
          />
          <UserStats
            src={avatarPlaceholder}
            alt="image"
            number={0}
            desc={t("stats.segments")}
          />
        </div>
        <div className={styles.tags}>
          <span className="pill">{t("profile.storyteller")}</span>
          <span className="pill">{t("profile.collaborator")}</span>
        </div>
      </section>

      <nav className={styles.tabs}>
        <button
          className={activeTab === "contributions" ? styles.active : styles.tab}
          onClick={() => setActiveTab("contributions")}
        >
          Contributions
        </button>
        {/* <button
          className={activeTab === "favs" ? styles.active : styles.tab}
          onClick={() => setActiveTab("favs")}
        >
          Favorites
        </button> */}
        <button
          className={activeTab === "activity" ? styles.active : styles.tab}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          className={activeTab === "network" ? styles.active : styles.tab}
          onClick={() => setActiveTab("network")}
        >
          Network Activity
        </button>
        <button
          className={activeTab === "relations" ? styles.active : styles.tab}
          onClick={() => setActiveTab("relations")}
        >
          Relations
        </button>
      </nav>

      <div className={styles.panel}>
        {activeTab === "contributions" && (
          <ContributionList contributions={contributions} />
        )}
        {activeTab === "favs" && (
          <>
            {favoritesError && (
              <div style={{ color: "red" }}>{favoritesError}</div>
            )}
            {isLoadingFavorites && <div>Loading favorites...</div>}
            {!isLoadingFavorites && <StoryThumbnailList stories={favorites} />}
            {!isLoadingFavorites && !favorites.length && (
              <p style={{ color: "var(--muted)" }}>No favorites yet.</p>
            )}
          </>
        )}
        {activeTab === "activity" && (
          <>
            {activityError && (
              <div style={{ color: "red" }}>{activityError}</div>
            )}
            {isLoadingActivity && <div>Loading activity...</div>}
            {!isLoadingActivity && <ActivityBoxList activity={activity} />}
          </>
        )}
        {activeTab === "network" && (
          <>
            {networkError && <div style={{ color: "red" }}>{networkError}</div>}
            <div className={styles.networkFilters}>
              <button
                className={
                  networkFilter === "followers" ? styles.active : styles.tab
                }
                onClick={() => setNetworkFilter("followers")}
              >
                Followers
              </button>
              <button
                className={
                  networkFilter === "following" ? styles.active : styles.tab
                }
                onClick={() => setNetworkFilter("following")}
              >
                Following
              </button>
            </div>
            {isLoadingNetwork && <div>Loading network activity...</div>}
            {!isLoadingNetwork && (
              <ActivityBoxList activity={networkActivity} />
            )}
            {!isLoadingNetwork && !networkActivity.length && (
              <p style={{ color: "var(--muted)" }}>No activity yet.</p>
            )}
          </>
        )}
        {activeTab === "relations" && (
          <div>
            <div className={styles.relationsNav}>
              <button
                className={
                  activeSubTab === "followers" ? styles.active : styles.tab
                }
                onClick={() => setActiveSubTab("followers")}
              >
                Followers
              </button>
              <button
                className={
                  activeSubTab === "following" ? styles.active : styles.tab
                }
                onClick={() => setActiveSubTab("following")}
              >
                Following
              </button>
              <button
                className={
                  activeSubTab === "discover" ? styles.active : styles.tab
                }
                onClick={() => setActiveSubTab("discover")}
              >
                Discover
              </button>
            </div>
            {relationsError && (
              <div style={{ color: "red" }}>{relationsError}</div>
            )}
            {isLoadingRelations && (
              <div className={styles.relationRow}>Loading...</div>
            )}
            {!isLoadingRelations &&
              activeSubTab === "following" &&
              following.map((rel) => (
                <div key={rel.id} className={styles.relationRow}>
                  <div className={styles.relationInfo}>
                    <img
                      src={rel.avatar_url || avatarPlaceholder}
                      alt={rel.username}
                      className={styles.relationAvatar}
                    />
                    <div>
                      <div className={styles.relationName}>
                        {rel.display_name || rel.username}
                      </div>
                      <div className={styles.relationMeta}>
                        {rel.followers_count ?? 0} followers
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn ghost"
                    onClick={() => handleUnfollow(rel.id)}
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            {!isLoadingRelations &&
              activeSubTab === "followers" &&
              followers.map((rel) => (
                <div key={rel.id} className={styles.relationRow}>
                  <div className={styles.relationInfo}>
                    <img
                      src={rel.avatar_url || avatarPlaceholder}
                      alt={rel.username}
                      className={styles.relationAvatar}
                    />
                    <div>
                      <div className={styles.relationName}>
                        {rel.display_name || rel.username}
                      </div>
                      <div className={styles.relationMeta}>
                        {rel.followers_count ?? 0} followers
                      </div>
                    </div>
                  </div>
                  {isFollowingUser(rel.id) ? (
                    <button
                      className="btn ghost"
                      onClick={() => handleUnfollow(rel.id)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="btn primary"
                      onClick={() => handleFollow(rel.id)}
                    >
                      Follow back
                    </button>
                  )}
                </div>
              ))}
            {!isLoadingDiscover && activeSubTab === "discover" && (
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
                      <img
                        src={rel.avatar_url || avatarPlaceholder}
                        alt={rel.username}
                        className={styles.relationAvatar}
                      />
                      <div>
                        <div className={styles.relationName}>
                          {rel.display_name || rel.username}
                        </div>
                        <div className={styles.relationMeta}>
                          {rel.followers_count ?? 0} followers
                        </div>
                      </div>
                    </div>
                    {isFollowingUser(rel.id) ? (
                      <button
                        className="btn ghost"
                        onClick={() => handleUnfollow(rel.id)}
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        className="btn primary"
                        onClick={() => handleFollow(rel.id)}
                      >
                        Follow
                      </button>
                    )}
                  </div>
                ))}
                {!isLoadingDiscover && discover.length === 0 && (
                  <p style={{ color: "var(--muted)" }}>No users found.</p>
                )}
              </div>
            )}
            {!isLoadingRelations &&
              activeSubTab === "following" &&
              following.length === 0 && (
                <p style={{ color: "var(--muted)" }}>
                  You are not following anyone yet.
                </p>
              )}
            {!isLoadingRelations &&
              activeSubTab === "followers" &&
              followers.length === 0 && (
                <p style={{ color: "var(--muted)" }}>No followers yet.</p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

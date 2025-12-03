import { useState } from 'react';
import UserStats from '../../components/UserStats/UserStats';
import StoryThumbnailList from '../../components/StoryThumbnailList/StoryThumbnailList';
import ActivityBoxList from '../../components/ActivityBoxList/ActivityBoxList';
import ContributionList from '../../components/ContributionList/ContributionList';
import styles from './Profile.module.css';
import { useAuth } from '../../context/AuthContext.jsx';
import coverPlaceholder from '../../assets/cover.svg';
import avatarPlaceholder from '../../assets/avatar.svg';

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contributions');
  const [activeSubTab, setActiveSubTab] = useState('following');
  const aut_list = [avatarPlaceholder, avatarPlaceholder];
  const tag_list = ['fantasy', 'adventure', 'collaboration'];

  const stories = [];
  const activity = [];
  const contributions = [];
  const relations = [];

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
        <button className={activeTab === 'relations' ? styles.active : styles.tab} onClick={() => setActiveTab('relations')}>
          Relations
        </button>
      </nav>

      <div className={styles.panel}>
        {activeTab === 'contributions' && <ContributionList contributions={contributions} />}
        {activeTab === 'favs' && (
          <StoryThumbnailList
            stories={[
              { src: coverPlaceholder, alt: 'image', title: 'Sample story', desc: 'A story you favorited.', tags: tag_list, authors: aut_list, segments: '0', views: '0', comments: '0', rating: '—', updated: '—' },
            ]}
          />
        )}
        {activeTab === 'activity' && <ActivityBoxList activity={activity} />}
        {activeTab === 'relations' && (
          <div>
            <div className={styles.relationsNav}>
              <button className={activeSubTab === 'following' ? styles.active : styles.tab} onClick={() => setActiveSubTab('following')}>
                Following
              </button>
              <button className={activeSubTab === 'followers' ? styles.active : styles.tab} onClick={() => setActiveSubTab('followers')}>
                Followers
              </button>
            </div>
            {relations.map((rel, index) => (
              <div key={index}>{rel.username}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

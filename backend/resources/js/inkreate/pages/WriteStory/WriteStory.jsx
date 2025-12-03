import { useState } from 'react';
import SegmentImageText from '../../components/SegmentImageText/SegmentImageText';
import styles from './WriteStory.module.css';
import coverPlaceholder from '../../assets/cover.svg';
import DiscardableChip from '../../components/DiscardableChip/DiscardableChip';
import ChatContactList from '../../components/ChatContactList/ChatContactList';
import NewSegment from '../../components/NewSegment/NewSegment';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';

const GENRES = ['Fantasy', 'Romance', 'Mystery', 'Science Fiction', 'Adventure', 'Thriller', 'Horror', 'Comedy', 'Drama'];

function WriteStory() {
  const { token, updateUserLocal } = useAuth();
  const [inputs, setInputs] = useState({ visibility: 'Anyone', cover_image_url: coverPlaceholder, estimated_duration: 10 });
  const [selected, setSelected] = useState({ genre: '' });
  const [tagInput, setTagInput] = useState('');
  const [isFollowers, setIsFollowers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(coverPlaceholder);
  const [tagList, setTagList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [segData, setSegData] = useState({});

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
    if (e.target.name === 'visibility') setIsFollowers(e.target.value === 'Followers');
  };

  const updateSelected = (e) => {
    setSelected((values) => ({ ...values, [e.target.name]: e.target.value }));

    if (e.target.name === 'genre' && e.target.value) {
      const newTag = { text: e.target.value };
      setTagList((prev) => {
        const exists = prev.some((tag) => tag.text === newTag.text);
        return exists ? prev : [...prev, newTag];
      });
      setSelected((prev) => ({ ...prev, genre: '' }));
    }
  };

  const updateThumbnail = () => {
    setThumbnail(inputs.cover_image_url || coverPlaceholder);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const newTag = { text: tagInput.trim() };
    setTagList((prev) => {
      const exists = prev.some((tag) => tag.text.toLowerCase() === newTag.text.toLowerCase());
      return exists ? prev : [...prev, newTag];
    });
    setTagInput('');
  };

  const removeTag = (text) => {
    setTagList((prev) => prev.filter((tag) => tag.text !== text));
  };

  const removeUser = (username) => {
    setUserList((prev) => prev.filter((user) => user.username !== username));
  };

  const addUsers = (selectedContacts) => {
    setUserList((prev) => {
      const updatedList = selectedContacts.filter((contact) => !prev.some((user) => user.username === contact.username));
      return [...prev, ...updatedList];
    });
    setIsOpen(false);
  };

  const createStory = async () => {
    if (!token) {
      alert('Please login first.');
      return;
    }
    if (!(segData.content || inputs.synopsis)) {
      alert('Please add at least the first segment content or a synopsis.');
      return;
    }
    const story = await api.createStory(token, {
      title: inputs.title,
      synopsis: inputs.synopsis,
      genre: selected.genre || GENRES[0],
      is_public: inputs.visibility !== 'Private',
      is_collaborative: true,
      allow_forks: true,
      tags: tagList.map((t) => t.text),
      cover_image_url: thumbnail,
      estimated_duration: Number(inputs.estimated_duration) || 10,
    });
    await api.createSegment(token, story.id, {
      title: inputs.title,
      content: segData.content || inputs.synopsis,
      image_url: segData.image_url,
      choices: segData.choices || [],
    });
    // Rafraîchir le profil pour mettre à jour les stats (stories_count, etc.)
    api.profile(token).then(updateUserLocal).catch(() => {});
    alert(`Story created: ${story.title}`);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2>Create New Story</h2>
        <p>Start a new collaborative story and invite others to contribute</p>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            Story Title
            <input type="text" name="title" value={inputs.title ?? ''} onChange={updateValue} placeholder="Enter your story title..." />
          </label>
          <label className={styles.field}>
            Genre
            <select name="genre" value={selected.genre} onChange={updateSelected}>
              <option value="" disabled hidden>
                Select a genre...
              </option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            Estimated duration (min)
            <input type="number" name="estimated_duration" value={inputs.estimated_duration ?? 10} onChange={updateValue} min="1" max="240" />
          </label>
        </div>

        <label className={`${styles.field} ${styles.full}`}>
          Description
          <textarea name="synopsis" value={inputs.synopsis ?? ''} onChange={updateValue} placeholder="Describe your story premise..." rows={3} />
        </label>

        <SegmentImageText
          src={thumbnail}
          img_title="Book Cover Images"
          txt_title="Synopsis"
          name="synopsis"
          inputs={inputs}
          updateValue={updateValue}
          updateImage={updateThumbnail}
          onFileSelect={(file) => setThumbnail(URL.createObjectURL(file))}
        />

        <label>
          Who can create segments?
          <select name="visibility" value={inputs.visibility} onChange={updateValue}>
            <option value="Only Me">Only Me</option>
            <option value="Followers">Followers</option>
            <option value="Anyone">Anyone</option>
          </select>
        </label>

        <div className={styles.tagRow}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag and press Add"
          />
          <button type="button" className="btn ghost" onClick={addTag}>
            Add
          </button>
        </div>

        <div className={styles.chips}>
          {tagList.map((tag, index) => (
            <DiscardableChip key={index} text={tag.text} removeChip={removeTag} />
          ))}
        </div>

        {isFollowers && (
          <div className="stack">
            <span className={styles.sectionLabel}>Contributors</span>
            <ChatContactList isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={addUsers} />
            <button className="btn ghost" onClick={() => setIsOpen(true)}>
              Add collaborators
            </button>
            <div className={styles.chips}>
              {userList.map((user, index) => (
                <DiscardableChip key={index} src={user.src} text={user.username} removeChip={removeUser} />
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button className="btn primary" onClick={createStory}>
            Save Story
          </button>
          <button className="btn ghost">Share</button>
          <button className="btn ghost">Preview</button>
        </div>
      </section>

      <section className={styles.card}>
        <h3>Add New Segment</h3>
        <NewSegment
          isPortal={false}
          isFirst={true}
          setSegData={setSegData}
        />
        <div className={styles.actions}>
          <button className="btn primary" onClick={createStory}>Publish Story</button>
        </div>
      </section>
    </div>
  );
}

export default WriteStory;

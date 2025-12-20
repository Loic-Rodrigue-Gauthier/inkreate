import { useMemo, useState } from 'react';
import { LinkedList } from '../../utils/LinkedList';
import SegmentImageText from '../../components/SegmentImageText/SegmentImageText';
import styles from './WriteStory.module.css';
import coverPlaceholder from '../../assets/cover.svg';
import instagramIcon from '../../assets/instagram.svg';
import xIcon from '../../assets/x.svg';
import linkedinIcon from '../../assets/linkedin.svg';
import facebookIcon from '../../assets/facebook.svg';
import DiscardableChip from '../../components/DiscardableChip/DiscardableChip';
import ChatContactList from '../../components/ChatContactList/ChatContactList';
import NewSegment from '../../components/NewSegment/NewSegment';
import { api, ensureAbsoluteUrl } from '../../services/apiClient';
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
  const [tagList, setTagList] = useState(() => new LinkedList());
  const [userList, setUserList] = useState(() => new LinkedList());
  const [segData, setSegData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const shareBase = typeof window !== 'undefined' ? window.location.origin : '';
  const [showShareOptions, setShowShareOptions] = useState(false);

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
    if (e.target.name === 'visibility') setIsFollowers(e.target.value === 'Followers');
  };

  const updateSelected = (e) => {
    setSelected((values) => ({...values, [e.target.name]: e.target.value, })) 

    if (e.target.name === "genre" && e.target.value) {
      const newTag = { text: e.target.value } 

      setTagList((prev) => {
        const list = prev.clone() 
        const exists = list.toArray().some((tag) => tag.text === newTag.text) 

        if (!exists) {
          list.addLast(newTag)
        }

        return list 
      }) 

      setSelected((prev) => ({ ...prev, genre: "" })) 
    }
  }

  const updateThumbnail = () => {
    const url = ensureAbsoluteUrl(inputs.cover_image_url) || inputs.cover_image_url;
    setThumbnail(url || coverPlaceholder);
  };

  const handleCoverUpload = async (file) => {
    if (!token || !file) return;
    try {
      const res = await api.uploadImage(token, file);
      const url = ensureAbsoluteUrl(res.url || res.data?.url);
      if (url) {
        setInputs((prev) => ({ ...prev, cover_image_url: url }));
        setThumbnail(url);
      }
    } catch (_e) {
      // ignore upload errors silently for now
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const newTag = { text: tagInput.trim() };
    setTagList((prev) => {
      const list = prev.clone();
      const exists = list.toArray().some((tag) => tag.text.toLowerCase() === newTag.text.toLowerCase());
      if (!exists) {
        list.addLast(newTag);
      }
      return list;
    });
    setTagInput('');
  };

  const removeTag = (text) => {
    setTagList(prev => {
      const list = prev.clone()
      list.removeByValue('text', text)
      return list
    })
  }

  const removeUser = (username) => {
    setUserList(prev => {
      const list = prev.clone()
      list.removeByValue('username', username)
      return list
    })
  }

  const addUsers = (selectedContacts) => {
    setUserList(prev => {
      const list = prev.clone()

      selectedContacts.forEach(contact => {
        const exists = list
          .toArray()
          .some(user => user.username === contact.username)

        if (!exists) {
          list.addLast(contact)
        }
      })

      return list
    })

    setIsOpen(false)
  }

  const createStory = async () => {
    if (!token) {
      setError('Please login first.');
      return;
    }
    if (!(segData.content || inputs.synopsis)) {
      setError('Please add at least the first segment content or a synopsis.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      let firstSegmentImageUrl = segData.image_url;
      if (segData._uploadFile) {
        try {
          const up = await api.uploadImage(token, segData._uploadFile);
          firstSegmentImageUrl = ensureAbsoluteUrl(up.url || up.data?.url) || firstSegmentImageUrl;
        } catch (_e) {
          // ignore upload errors
        }
      }
      const choices =
        (segData.choices && segData.choices.length ? segData.choices : [])
          .concat(segData.pending_choice ? [segData.pending_choice] : [])
          .filter((c) => typeof c === 'string' && c.trim().length)
          .map((c) => c.trim());

      const created = await api.createStory(token, {
        title: inputs.title,
        synopsis: inputs.synopsis,
        genre: selected.genre || GENRES[0],
        is_public: inputs.visibility !== 'Private',
        is_collaborative: true,
        allow_forks: true,
        tags: tagList.toArray().map((t) => t.text),
        cover_image_url: thumbnail === coverPlaceholder ? null : thumbnail,
        estimated_duration: Number(inputs.estimated_duration) || 10,
      });
      const story = (created && created.data) ? created.data : created;
      await api.createSegment(token, story.id, {
        title: inputs.title,
        content: segData.content || inputs.synopsis,
        image_url: firstSegmentImageUrl,
        choices,
      });
      api.profile(token).then(updateUserLocal).catch(() => {});
      setError(null);
      alert(`Story created: ${story.title}`);
    } catch (err) {
      setError(err?.message || 'Unable to create story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    setShowShareOptions((prev) => !prev);
  };

  const shareMessage = useMemo(() => {
    const tags = tagList.toArray().map((t) => t.text).join(', ');
    const synopsis = inputs.synopsis || '';
    return `Check out my story: ${inputs.title || 'Untitled'}${synopsis ? ' — ' + synopsis : ''}${tags ? ' | Tags: ' + tags : ''} #InKreate`;
  }, [inputs.title, inputs.synopsis, tagList]);

  const shareUrl = useMemo(() => `${shareBase}/read-story`, [shareBase]);

  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(shareUrl);

  const openPreview = () => {
    setPreviewOpen(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2>Create New Story</h2>
        <p>Start a new collaborative story and invite others to contribute</p>
        {error && <div style={{ color: 'red' }}>{error}</div>}

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

        <div className={styles.chips}>
          {tagList.toArray().map(tag => (
            <DiscardableChip
              key={tag.text}
              text={tag.text}
              removeChip={() => removeTag(tag.text)}
            />
          ))}
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
          onFileSelect={handleCoverUpload}
        />

        <label>
          Who can create segments?
          <select name="visibility" value={inputs.visibility} onChange={updateValue}>
            <option value="Only Me">Only Me</option>
            <option value="Followers">Followers</option>
            <option value="Anyone">Anyone</option>
          </select>
        </label>

        {/* <div className={styles.tagRow}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag and press Add"
          />
          <button type="button" className="btn ghost" onClick={addTag}>
            Add
          </button>
        </div> */}

        

        {isFollowers && (
          <div className="stack">
            <span className={styles.sectionLabel}>Contributors</span>
            <ChatContactList isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={addUsers} />
            <button className="btn ghost" onClick={() => setIsOpen(true)}>
              Add collaborators
            </button>
            <div className={styles.chips}>
              {userList.toArray().map(user => (
                <DiscardableChip
                  key={user.username}
                  src={user.src}
                  text={user.username}
                  removeChip={removeUser}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button className="btn primary" onClick={createStory} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Story'}
          </button>
          <button className="btn ghost" onClick={handleShare} disabled={isSubmitting}>Share</button>
          <button className="btn ghost" onClick={openPreview} disabled={isSubmitting}>Preview</button>
        </div>
        {showShareOptions && (
          <div className={styles.sharePanel}>
            <h4>Share your story</h4>
            <div className={styles.shareRow}>
              <a className={styles.shareLink} href={`https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`} target="_blank" rel="noreferrer">
                <img src={xIcon} alt="X" className={styles.icon} /> X / Twitter
              </a>
              <a className={styles.shareLink} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`} target="_blank" rel="noreferrer">
                <img src={facebookIcon} alt="Facebook" className={styles.icon} /> Facebook
              </a>
              <a className={styles.shareLink} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" className={styles.icon} /> LinkedIn
              </a>
              <a className={styles.shareLink} href={`https://www.instagram.com/?url=${encodedUrl}`} target="_blank" rel="noreferrer">
                <img src={instagramIcon} alt="Instagram" className={styles.icon} /> Instagram
              </a>
              <a className={styles.shareLink} href={`mailto:?subject=${encodeURIComponent(inputs.title || 'My story on InKreate')}&body=${encodedMessage}%0A${encodedUrl}`} target="_blank" rel="noreferrer">✉️ Email</a>
            </div>
            <div className={styles.shareCredit}>
              <a href="https://www.flaticon.com/free-icons/instagram" title="instagram icons" target="_blank" rel="noreferrer">
                Instagram icon by Freepik - Flaticon
              </a>
            </div>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h3>Add New Segment</h3>
        <NewSegment
          isPortal={false}
          isFirst={true}
          setSegData={setSegData}
        />
        <div className={styles.actions}>
          <button className="btn primary" onClick={createStory} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Story'}
          </button>
        </div>
      </section>

      {previewOpen && (
        <div className={styles.modalBg} onClick={() => setPreviewOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Preview</h3>
              <button onClick={() => setPreviewOpen(false)}>✕</button>
            </div>
            <img src={thumbnail || coverPlaceholder} alt="cover" className={styles.previewImg} />
            <h4>{inputs.title || 'Untitled story'}</h4>
            <p className={styles.previewMeta}>{selected.genre || 'Genre not set'} • {inputs.visibility}</p>
            <p>{inputs.synopsis || 'No synopsis yet.'}</p>
            <p className={styles.previewTags}>{tagList.toArray().map((t) => t.text).join(', ')}</p>
            {segData.content && (
              <div className={styles.previewSegment}>
                <h5>First segment</h5>
                <p>{segData.content}</p>
              </div>
            )}
            <button className="btn primary" onClick={() => setPreviewOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WriteStory;

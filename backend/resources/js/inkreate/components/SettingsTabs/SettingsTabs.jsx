import { useEffect, useState, useRef } from 'react';
import styles from './SettingsTabs.module.css';
import { useTheme } from '../../context/ThemeContext.jsx';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';
import avatarPlaceholder from '../../assets/avatar.svg';

function Appearance() {
  const [inputs, setInputs] = useState({ language: 'English' });
  const { theme, setTheme } = useTheme();
  const formRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    setInputs((prev) => ({ ...prev }));
  }, []);

  const updateValue = (e) => {
    const { name, value } = e.target;
    if (name === 'theme') {
      setTheme(value.toLowerCase());
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
    formRef.current.requestSubmit();
  };

  function submitForm(e) {
    e.preventDefault();
    if (!token) return;
    api.updateProfile(token, { language: inputs.language }).catch(() => {});
  }

  return (
    <div className={styles.panel}>
      <form onSubmit={submitForm} ref={formRef}>
        <label>
          Theme
          <select name="theme" value={theme === 'dark' ? 'Dark' : 'Light'} onChange={updateValue}>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </label>
        <label>
          Language
          <select name="language" value={inputs.language} onChange={updateValue}>
            <option value="English">English</option>
            <option value="French">French</option>
          </select>
        </label>
      </form>
    </div>
  );
}

function Profile() {
  const { token, user, updateUserLocal } = useAuth();
  const [inputs, setInputs] = useState({
    display_name: '',
    bio: '',
    preferred_genres: '',
    timezone: 'UTC',
  });
  const [image, setImage] = useState(user?.avatar_url || avatarPlaceholder);

  useEffect(() => {
    if (!user) return;
    setInputs({
      display_name: user.display_name || '',
      bio: user.bio || '',
      preferred_genres: (user.preferred_genres || []).join(', '),
      timezone: user.timezone || 'UTC',
    });
    setImage(user.avatar_url || avatarPlaceholder);
  }, [user]);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  async function submitForm(e) {
    e.preventDefault();
    if (!token) return;
    const payload = {
      display_name: inputs.display_name,
      bio: inputs.bio,
      preferred_genres: inputs.preferred_genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      timezone: inputs.timezone,
      avatar_url: image,
    };
    const updated = await api.updateProfile(token, payload);
    updateUserLocal(updated);
    alert('Profile updated');
  }

  const deleteAccount = async () => {
    if (!token) return;
    await api.deleteAccount(token);
    window.location.href = '/authentication';
  };

  return (
    <div className={styles.panel}>
      <div className={styles.actions}>
        <label>
          Profile Picture
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <img
            src={image}
            alt="avatar"
            onClick={(e) => e.target.previousSibling.click()}
            style={{ width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer' }}
          />
        </label>
      </div>
      <form onSubmit={submitForm}>
        <label>
          Display Name
          <input type="text" name="display_name" value={inputs.display_name} onChange={updateValue} />
        </label>
        <label>
          Bio
          <textarea name="bio" value={inputs.bio} onChange={updateValue} placeholder="Tell collaborators about you..." />
        </label>
        <label>
          Preferred genres (comma-separated)
          <input type="text" name="preferred_genres" value={inputs.preferred_genres} onChange={updateValue} />
        </label>
        <label>
          Timezone
          <input type="text" name="timezone" value={inputs.timezone} onChange={updateValue} />
        </label>
        <button type="submit">
          Save Changes
        </button>
      </form>
      <div className={styles.danger} onClick={deleteAccount}>Delete Account</div>
    </div>
  );
}

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className={styles.component}>
      <h1>Settings</h1>
      <nav>
        <button className={activeTab === 'profile' ? styles.active : styles.tab} onClick={() => setActiveTab('profile')}>
          Profile
        </button>
        <button className={activeTab === 'appearance' ? styles.active : styles.tab} onClick={() => setActiveTab('appearance')}>
          Appearance
        </button>
      </nav>
      <div>
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'appearance' && <Appearance />}
      </div>
    </div>
  );
}

export default SettingsTabs;

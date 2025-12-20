import { useEffect, useState, useRef } from 'react';
import styles from './SettingsTabs.module.css';
import { useTheme } from '../../context/ThemeContext.jsx';
import { api, resourceData } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';
import avatarPlaceholder from '../../assets/avatar.svg';
import { useI18n } from '../../context/I18nContext.jsx';

function Appearance() {
  const [inputs, setInputs] = useState({ language: 'English' });
  const { theme, setTheme } = useTheme();
  const formRef = useRef(null);
  const { token, user } = useAuth();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    setInputs((prev) => ({ ...prev, language: language === 'fr' ? 'French' : 'English' }));
  }, [language]);

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language || 'en');
    }
  }, [user, setLanguage]);

  const updateValue = (e) => {
    const { name, value } = e.target;
    if (name === 'theme') {
      setTheme(value.toLowerCase());
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
      setLanguage(value === 'French' ? 'fr' : 'en');
    }
    formRef.current.requestSubmit();
  };

  function submitForm(e) {
    e.preventDefault();
    if (!token) return;
    const langCode = inputs.language === 'French' ? 'fr' : 'en';
    api.updateProfile(token, { language: langCode }).catch(() => {});
  }

  return (
    <div className={styles.panel}>
      <form onSubmit={submitForm} ref={formRef}>
        <label>
          {t('appearance.theme')}
          <select name="theme" value={theme === 'dark' ? 'Dark' : 'Light'} onChange={updateValue}>
            <option value="Light">{t('appearance.light')}</option>
            <option value="Dark">{t('appearance.dark')}</option>
          </select>
        </label>
        <label>
          {t('appearance.language')}
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
  const { t } = useI18n();
  const [inputs, setInputs] = useState({
    display_name: '',
    bio: '',
    preferred_genres: '',
    timezone: 'UTC',
  });
  const [image, setImage] = useState(user?.avatar_url || avatarPlaceholder);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  useEffect(() => {
    if (!user) return;
    setInputs({
      display_name: user.display_name || '',
      bio: user.bio || '',
      preferred_genres: (user.preferred_genres || []).join(', '),
      timezone: user.timezone || 'UTC',
    });
    setAvatarUrl(user.avatar_url || '');
    setImage(user.avatar_url || avatarPlaceholder);
  }, [user]);

  const handleFile = async (file) => {
    if (!file || !token) return;
    // preview immediately
    const localPreview = URL.createObjectURL(file);
    setImage(localPreview);
    try {
      const uploaded = await api.uploadImage(token, file);
      const url = uploaded.url || uploaded.data?.url;
      if (url) {
        setAvatarUrl(url);
        setImage(url);
      }
    } catch (_e) {
      // ignore upload error, keep current image/preview
    }
  };

  const updateValue = (e) => {
    setInputs((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  async function submitForm(e) {
    e.preventDefault();
    if (!token) return;
    const remoteAvatar = avatarUrl || (typeof image === 'string' && image.startsWith('http') ? image : '');
    const payload = {
      display_name: inputs.display_name,
      bio: inputs.bio,
      preferred_genres: inputs.preferred_genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      timezone: inputs.timezone,
      avatar_url: remoteAvatar || null,
    };
    const updated = await api.updateProfile(token, payload);
    updateUserLocal(resourceData(updated));
    alert(t('profile.updated'));
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
          {t('profile.picture')}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <img
            src={image}
            alt="avatar"
            onError={() => setImage(avatarPlaceholder)}
            style={{ width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
          />
        </label>
      </div>
      <form onSubmit={submitForm}>
        <label>
          {t('profile.displayName')}
          <input type="text" name="display_name" value={inputs.display_name} onChange={updateValue} />
        </label>
        <label>
          {t('profile.bio')}
          <textarea name="bio" value={inputs.bio} onChange={updateValue} placeholder="Tell collaborators about you..." />
        </label>
        <label>
          {t('profile.genres')}
          <input type="text" name="preferred_genres" value={inputs.preferred_genres} onChange={updateValue} />
        </label>
        <label>
          {t('profile.timezone')}
          <input type="text" name="timezone" value={inputs.timezone} onChange={updateValue} />
        </label>
        <button type="submit">
          {t('profile.save')}
        </button>
      </form>
      <div className={styles.danger} onClick={deleteAccount}>{t('profile.delete')}</div>
    </div>
  );
}

function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useI18n();

  return (
    <div className={styles.component}>
      <h1>{t('settings.title')}</h1>
      <nav>
        <button className={activeTab === 'profile' ? styles.active : styles.tab} onClick={() => setActiveTab('profile')}>
          {t('settings.tabs.profile')}
        </button>
        <button className={activeTab === 'appearance' ? styles.active : styles.tab} onClick={() => setActiveTab('appearance')}>
          {t('settings.tabs.appearance')}
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

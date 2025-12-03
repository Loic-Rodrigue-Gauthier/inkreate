import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, resourceData, ApiError } from '../services/apiClient.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'inkreate.token';
const USER_KEY = 'inkreate.user';

const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    stories_count: u.stories_count ?? u.stats?.stories ?? 0,
    segments_count: u.segments_count ?? u.stats?.segments ?? 0,
    followers_count: u.followers_count ?? u.stats?.followers ?? 0,
    following_count: u.following_count ?? u.stats?.following ?? 0,
  };
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? normalizeUser(JSON.parse(stored)) : null;
    } catch (error) {
      console.warn('Cannot parse stored user', error);
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(!!token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);

  const persistSession = useCallback((nextToken, nextUser) => {
    const normalized = normalizeUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setUser(normalized);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    if (user) {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;
    setIsInitializing(true);

    apiFetch('/api/auth/profile', { token })
      .then((profile) => {
        if (!isMounted) return;
        const normalized = normalizeUser(resourceData(profile));
        persistSession(token, normalized);
        setIsInitializing(false);
      })
      .catch(() => {
        if (!isMounted) return;
        clearSession();
        setIsInitializing(false);
        setAuthError('Session expirée. Veuillez vous reconnecter.');
      });

    return () => {
      isMounted = false;
    };
  }, [token, user, persistSession, clearSession]);

  const handleAuthError = useCallback((error) => {
    if (error instanceof ApiError) {
      setAuthError(error.message);
      throw error;
    }
    setAuthError("Une erreur inattendue s'est produite.");
    throw error;
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const response = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        persistSession(response.token, response.user);
        return response.user;
      } catch (error) {
        handleAuthError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleAuthError, persistSession],
  );

  const register = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const response = await apiFetch('/api/auth/register', {
          method: 'POST',
          body: payload,
        });
        persistSession(response.token, response.user);
        return response.user;
      } catch (error) {
        handleAuthError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleAuthError, persistSession],
  );

  const logout = useCallback(async () => {
    if (!token) {
      clearSession();
      return;
    }

    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        token,
      });
    } catch (error) {
      console.warn('Erreur lors de la déconnexion', error);
    } finally {
      clearSession();
    }
  }, [token, clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      authError,
      isInitializing,
      isSubmitting,
      login,
      register,
      logout,
      clearSession,
      setAuthError,
      setUser,
      setToken,
      updateUserLocal: (nextUser) => {
        const normalized = normalizeUser(nextUser);
        setUser(normalized);
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      },
    }),
    [token, user, authError, isInitializing, isSubmitting, login, register, logout, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

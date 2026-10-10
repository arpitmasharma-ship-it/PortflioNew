import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const PortfolioContext = createContext(null);

async function loadAll() {
  const [profile, skills, projects, experience, education, achievements, social, posts] =
    await Promise.all([
      api.get('/profile'),
      api.get('/skills', { params: { limit: 50 } }),
      api.get('/projects', { params: { limit: 50 } }),
      api.get('/experience', { params: { limit: 50 } }),
      api.get('/education', { params: { limit: 20 } }),
      api.get('/achievements', { params: { limit: 50 } }),
      api.get('/social', { params: { limit: 30 } }),
      api.get('/blog', { params: { limit: 20 } }),
    ]);

  return {
    profile: profile.data.data,
    skills: skills.data.data || [],
    projects: projects.data.data || [],
    experience: experience.data.data || [],
    education: education.data.data || [],
    achievements: achievements.data.data || [],
    social: (social.data.data || []).filter((link) => link.url),
    posts: posts.data.data || [],
  };
}

export function PortfolioProvider({ children }) {
  const [state, setState] = useState({
    profile: null,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    achievements: [],
    social: [],
    posts: [],
    loading: true,
    error: null,
  });

  async function refresh() {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await loadAll();
      setState({ ...data, loading: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error?.response?.data?.message || 'Unable to load portfolio content.',
      }));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(() => ({ ...state, refresh }), [state]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}

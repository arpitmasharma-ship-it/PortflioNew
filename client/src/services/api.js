import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

function readCookie(name) {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrf = readCookie('portfolio_csrf');
  if (csrf) config.headers['X-CSRF-Token'] = csrf;
  return config;
});

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error.message || fallback;
}

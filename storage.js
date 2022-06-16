import { TOKEN_ID } from '../api/BaseApi';

export const getParsedToken = () => {
  const token = localStorage.getItem(TOKEN_ID);
  if (token) {
    return JSON.parse(token);
  }
  return {};
};

export const setToken = (newToken) => localStorage.setItem(TOKEN_ID, JSON.stringify(newToken));

export const removeToken = () => setToken('');
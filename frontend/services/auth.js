import api from './api';
import useAuthStore from '../store/authStore';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  useAuthStore.getState().setToken(response.data.token);
  return response.data.user;
};

export const getUserInfo = async () => {
  const response = await api.get('/auth/me');
  useAuthStore.getState().setUser(response.data);
  return response.data;
};
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'postgresql://postgres:EyGkhIdtyWWkuaSlxocTunmBqYmzQIFt@yamanote.proxy.rlwy.net:28006/railway', // Your Railway backend URL
});

// Add JWT to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const customerApi = axios.create({ baseURL });
export const staffApi = axios.create({ baseURL });
export const publicApi = axios.create({ baseURL });

function attachToken(config, storageKey) {
  const token = localStorage.getItem(storageKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

customerApi.interceptors.request.use((config) => attachToken(config, 'customerToken'));
staffApi.interceptors.request.use((config) => attachToken(config, 'staffToken'));

export function extractErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

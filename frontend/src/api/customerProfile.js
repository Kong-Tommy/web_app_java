import { customerApi } from './client';

export const getProfile = () => customerApi.get('/api/customer/profile').then((r) => r.data);

export const updateProfile = (payload) =>
  customerApi.put('/api/customer/profile', payload).then((r) => r.data);

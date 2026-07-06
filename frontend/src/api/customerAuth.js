import { publicApi } from './client';

export const registerCustomer = (payload) =>
  publicApi.post('/api/customer/auth/register', payload).then((r) => r.data);

export const loginCustomer = (payload) =>
  publicApi.post('/api/customer/auth/login', payload).then((r) => r.data);

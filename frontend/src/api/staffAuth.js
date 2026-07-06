import { publicApi } from './client';

export const loginStaff = (payload) => publicApi.post('/api/auth', payload).then((r) => r.data);

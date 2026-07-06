import { customerApi } from './client';

export const checkout = (payload) => customerApi.post('/api/orders', payload).then((r) => r.data);
export const getMyOrders = () => customerApi.get('/api/orders').then((r) => r.data);
export const getMyOrder = (id) => customerApi.get(`/api/orders/${id}`).then((r) => r.data);

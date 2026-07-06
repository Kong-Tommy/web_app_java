import { staffApi } from './client';

export const adminGetProducts = () => staffApi.get('/api/products').then((r) => r.data);
export const adminGetCategories = () => staffApi.get('/api/categories').then((r) => r.data);
export const adminCreateProduct = (payload) => staffApi.post('/api/products', payload).then((r) => r.data);
export const adminUpdateProduct = (id, payload) => staffApi.put(`/api/products/${id}`, payload).then((r) => r.data);
export const adminDeleteProduct = (id) => staffApi.delete(`/api/products/${id}`).then((r) => r.data);
export const adminGetOrders = () => staffApi.get('/api/admin/orders').then((r) => r.data);
export const adminUpdateOrderStatus = (id, status) =>
  staffApi.put(`/api/admin/orders/${id}/status`, { status }).then((r) => r.data);

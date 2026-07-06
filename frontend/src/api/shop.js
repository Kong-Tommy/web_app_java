import { publicApi } from './client';

export const getProducts = () => publicApi.get('/api/shop/products').then((r) => r.data);
export const getProduct = (id) => publicApi.get(`/api/shop/products/${id}`).then((r) => r.data);
export const searchProducts = (name, category) =>
  publicApi
    .get('/api/shop/products/search', { params: { name, category } })
    .then((r) => r.data);
export const getCategories = () => publicApi.get('/api/shop/categories').then((r) => r.data);

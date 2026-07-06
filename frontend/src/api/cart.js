import { customerApi } from './client';

export const getCart = () => customerApi.get('/api/cart').then((r) => r.data);
export const addToCart = (productId, quantity) =>
  customerApi.post('/api/cart/items', { productId, quantity }).then((r) => r.data);
export const updateCartItem = (cartItemId, productId, quantity) =>
  customerApi.put(`/api/cart/items/${cartItemId}`, { productId, quantity }).then((r) => r.data);
export const removeCartItem = (cartItemId) =>
  customerApi.delete(`/api/cart/items/${cartItemId}`).then((r) => r.data);

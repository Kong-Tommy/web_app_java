import { createContext, useCallback, useContext, useState } from 'react';
import { getCart } from '../api/cart';
import { useCustomerAuth } from './CustomerAuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useCustomerAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isLoggedIn]);

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

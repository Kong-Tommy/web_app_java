import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeCartItem, updateCartItem } from '../api/cart';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function CartPage() {
  const { isLoggedIn } = useCustomerAuth();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      load();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const changeQty = async (item, newQty) => {
    if (newQty < 1) return;
    await updateCartItem(item.cartItemId, item.product.productId, newQty);
    await load();
    await refreshCart();
  };

  const removeItem = async (item) => {
    await removeCartItem(item.cartItemId);
    await load();
    await refreshCart();
  };

  if (!isLoggedIn) {
    return (
      <main className="page">
        <div className="container empty-state">
          <p>Vui long dang nhap de xem gio hang.</p>
          <Link to="/login" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>Dang nhap</Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <main className="page"><div className="container">Dang tai gio hang...</div></main>;
  }

  return (
    <main className="page">
      <div className="container">
        <div className="section-title">Gio hang cua ban</div>
        {cart.items.length === 0 ? (
          <div className="empty-state">Gio hang trong. <Link to="/" style={{ color: 'var(--shopee-orange)' }}>Tiep tuc mua sam</Link></div>
        ) : (
          <div className="card">
            {cart.items.map((item) => (
              <div className="cart-row" key={item.cartItemId}>
                <img src={item.product.imageUrl} alt={item.product.productName} />
                <div className="name">{item.product.productName}</div>
                <div className="price">{formatPrice(item.product.price)}</div>
                <div className="qty-control">
                  <button onClick={() => changeQty(item, item.quantity - 1)}>-</button>
                  <input value={item.quantity} readOnly />
                  <button onClick={() => changeQty(item, item.quantity + 1)}>+</button>
                </div>
                <div style={{ width: 100, fontWeight: 600 }}>{formatPrice(item.lineTotal)}</div>
                <button className="btn outline" onClick={() => removeItem(item)}>Xoa</button>
              </div>
            ))}
            <div className="cart-summary">
              <div>Tong cong: <strong className="price" style={{ fontSize: 20 }}>{formatPrice(cart.totalAmount)}</strong></div>
              <button className="btn" onClick={() => navigate('/checkout')}>Thanh toan</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

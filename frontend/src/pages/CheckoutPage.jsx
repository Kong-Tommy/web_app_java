import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import { extractErrorMessage } from '../api/client';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const order = await checkout({ shippingAddress, shippingPhone });
      await refreshCart();
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="section-title">Thanh toan</div>
        <div className="card">
          <h3 style={{ textAlign: 'left' }}>Dia chi nhan hang</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Dia chi giao hang</label>
              <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>So dien thoai nhan hang</label>
              <input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} required />
            </div>

            <h3 style={{ textAlign: 'left' }}>Don hang ({cart.items.length} san pham)</h3>
            {cart.items.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span>{item.product.productName} x{item.quantity}</span>
                <span>{formatPrice(item.lineTotal)}</span>
              </div>
            ))}

            <div className="cart-summary">
              <div>Tong thanh toan: <strong className="price" style={{ fontSize: 20 }}>{formatPrice(cart.totalAmount)}</strong></div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn block" type="submit" disabled={loading || cart.items.length === 0}>
              {loading ? 'Dang xu ly...' : 'Dat hang'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

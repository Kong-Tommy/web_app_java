import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';
import { extractErrorMessage } from '../api/client';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

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
  const { profile } = useCustomerAuth();

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const handleAutoFill = () => {
    setShippingAddress(profile?.address || '');
    setShippingPhone(profile?.phone || '');
  };

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
        <div className="section-title">Thanh toán</div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ textAlign: 'left' }}>Địa chỉ nhận hàng</h3>
            <button
              type="button"
              className="btn outline"
              onClick={handleAutoFill}
              disabled={!profile?.address && !profile?.phone}
            >
              Điền tự động
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Địa chỉ giao hàng</label>
              <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại nhận hàng</label>
              <input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} required />
            </div>

            <h3 style={{ textAlign: 'left' }}>Đơn hàng ({cart.items.length} sản phẩm)</h3>
            {cart.items.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span>{item.product.productName} x{item.quantity}</span>
                <span>{formatPrice(item.lineTotal)}</span>
              </div>
            ))}

            <div className="cart-summary">
              <div>Tổng thanh toán: <strong className="price" style={{ fontSize: 20 }}>{formatPrice(cart.totalAmount)}</strong></div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn block" type="submit" disabled={loading || cart.items.length === 0}>
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

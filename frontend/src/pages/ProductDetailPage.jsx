import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../api/shop';
import { addToCart } from '../api/cart';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerAuth();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await addToCart(product.productId, quantity);
    await refreshCart();
    setMessage('Đã thêm vào giỏ hàng!');
  };

  if (!product) {
    return (
      <main className="page">
        <div className="container">Đang tải...</div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="card" style={{ display: 'flex', gap: 24, textAlign: 'left' }}>
          <img
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400'}
            alt={product.productName}
            style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 4 }}
          />
          <div style={{ flex: 1 }}>
            <h2>{product.productName}</h2>
            <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              Danh mục: {product.category?.categoryName || 'N/A'}
            </div>
            <div className="price" style={{ fontSize: 28, margin: '12px 0' }}>
              {formatPrice(product.price)}
            </div>
            <div style={{ marginBottom: 8 }}>Chất liệu: {product.material || 'N/A'}</div>
            <div style={{ marginBottom: 16 }}>Còn lại: {product.quantity} sản phẩm</div>

            <div className="qty-control" style={{ marginBottom: 16 }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
              <input value={quantity} readOnly />
              <button onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}>+</button>
            </div>

            <button className="btn" onClick={handleAddToCart} disabled={product.quantity === 0}>
              {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            {message && <p className="success-text">{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

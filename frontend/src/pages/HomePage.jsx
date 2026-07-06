import { useEffect, useState } from 'react';
import { getProducts } from '../api/shop';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <div className="container">
        <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(90deg,#ff7337,#ee4d2d)', color: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Siêu Sale Cuối Năm - Giảm giá đến 50%</h1>
          <p style={{ marginTop: 6, opacity: 0.9 }}>Miễn phí vận chuyển cho đơn hàng từ $50</p>
        </div>

        <div className="section-title">Gợi Ý Hôm Nay</div>
        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

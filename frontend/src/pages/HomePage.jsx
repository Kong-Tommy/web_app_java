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
          <h1 style={{ margin: 0, fontSize: 22 }}>Sieu Sale Cuoi Nam - Giam gia den 50%</h1>
          <p style={{ marginTop: 6, opacity: 0.9 }}>Mien phi van chuyen cho don hang tu $50</p>
        </div>

        <div className="section-title">Goi Y Hom Nay</div>
        {loading ? (
          <p>Dang tai san pham...</p>
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

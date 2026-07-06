import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../api/shop';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const category = searchParams.get('category') || '';
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchProducts(name || undefined, category || undefined)
      .then(setGroups)
      .finally(() => setLoading(false));
  }, [name, category]);

  const totalCount = groups.reduce((sum, g) => sum + g.products.length, 0);

  return (
    <main className="page">
      <div className="container">
        <div className="section-title">
          Kết quả tìm kiếm {name && `cho "${name}"`} ({totalCount} sản phẩm)
        </div>
        {loading && <p>Đang tìm kiếm...</p>}
        {!loading && totalCount === 0 && (
          <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>
        )}
        {groups.map((group) => (
          <div key={group.categoryId} style={{ marginBottom: 24 }}>
            <h3 style={{ textAlign: 'left' }}>{group.categoryName}</h3>
            <div className="product-grid">
              {group.products.map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

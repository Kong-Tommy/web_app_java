import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories } from '../api/shop';

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <nav className="category-nav">
      <div className="container">
        <Link to="/" className={!activeCategory ? 'active' : ''}>Tất cả</Link>
        {categories.map((c) => (
          <Link
            key={c.categoryId}
            to={`/search?category=${c.categoryId}`}
            className={String(activeCategory) === String(c.categoryId) ? 'active' : ''}
          >
            {c.categoryName}
          </Link>
        ))}
      </div>
    </nav>
  );
}

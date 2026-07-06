import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.productId}`} className="product-card">
      <img src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400'} alt={product.productName} />
      <div className="info">
        <div className="name">{product.productName}</div>
        <div className="price">{formatPrice(product.price)}</div>
        <div className="sold">Con lai: {product.quantity}</div>
      </div>
    </Link>
  );
}

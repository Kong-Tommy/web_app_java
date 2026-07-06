import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useCustomerAuth();
  const { itemCount } = useCart();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?name=${encodeURIComponent(keyword)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Ho tro</span>
          <span>|</span>
          <Link to="/admin/login">Kenh Nguoi Ban</Link>
        </div>
      </div>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Logo height={36} />
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              placeholder="Tim san pham, thuong hieu..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">Tim kiem</button>
          </form>
          <div className="header-actions">
            <Link to="/cart" className="cart-badge">
              🛒 Gio hang
              {itemCount > 0 && <span className="count">{itemCount}</span>}
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/orders">Don hang cua toi</Link>
                <a onClick={handleLogout}>Dang xuat</a>
              </>
            ) : (
              <>
                <Link to="/login">Dang nhap</Link>
                <Link to="/register">Dang ky</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

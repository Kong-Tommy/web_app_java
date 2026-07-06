import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, profile } = useCustomerAuth();
  const { itemCount } = useCart();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?name=${encodeURIComponent(keyword)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Hỗ trợ</span>
          <span>|</span>
          <Link to="/admin/login">Kênh Người Bán</Link>
        </div>
      </div>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <Logo height={36} />
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              placeholder="Tìm sản phẩm, thương hiệu..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">🔍 Tìm kiếm</button>
          </form>
          <div className="header-actions">
            <Link to="/cart" className="header-btn cart-badge">
              🛒 Giỏ hàng
              {itemCount > 0 && <span className="count">{itemCount}</span>}
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/orders" className="header-btn">Đơn hàng của tôi</Link>
                <a className="header-btn" onClick={handleLogout}>Đăng xuất</a>
                <Link to="/profile" title="Thông tin tài khoản">
                  {profile?.avatarUrl ? (
                    <img className="avatar-circle" src={profile.avatarUrl} alt="Avatar" />
                  ) : (
                    <div className="avatar-circle">
                      {(profile?.fullName || profile?.email || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="header-btn">Đăng nhập</Link>
                <Link to="/register" className="header-btn">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

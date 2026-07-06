import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import Logo from './Logo';

export default function AdminLayout() {
  const { isLoggedIn, role, logout } = useStaffAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell" style={{ flexDirection: 'column' }}>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo height={28} />
          <strong>Kenh Nguoi Ban</strong>
        </div>
        <div>
          <span style={{ marginRight: 16 }}>Vai tro: {role}</span>
          <a onClick={handleLogout}>Dang xuat</a>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="admin-sidebar">
          <Link to="/admin/products" className={location.pathname.includes('/admin/products') ? 'active' : ''}>
            San pham
          </Link>
          <Link to="/admin/orders" className={location.pathname.includes('/admin/orders') ? 'active' : ''}>
            Don hang
          </Link>
        </aside>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

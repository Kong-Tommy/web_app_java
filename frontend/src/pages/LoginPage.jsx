import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api/customerAuth';
import { extractErrorMessage } from '../api/client';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import Logo from '../components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useCustomerAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginCustomer({ email, password });
      login(data.token);
      await refreshCart();
      navigate('/');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container auth-shell">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Logo height={40} variant="onLight" />
          </div>
          <h2>Dang nhap</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mat khau</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn block" type="submit" disabled={loading}>
              {loading ? 'Dang xu ly...' : 'Dang nhap'}
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 13 }}>
            Chua co tai khoan? <Link to="/register" style={{ color: 'var(--shopee-orange)' }}>Dang ky ngay</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

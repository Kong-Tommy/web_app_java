import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStaff } from '../../api/staffAuth';
import { extractErrorMessage } from '../../api/client';
import { useStaffAuth } from '../../context/StaffAuthContext';
import Logo from '../../components/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStaffAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginStaff({ email, password });
      login(data.token, data.role);
      navigate('/admin/products');
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
          <h2>Kenh Nguoi Ban</h2>
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
              {loading ? 'Dang xu ly...' : 'Dang nhap quan tri'}
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            Demo: admin@system.com / manager@system.com / analyst@system.com - mat khau: 123456
          </p>
        </div>
      </div>
    </main>
  );
}

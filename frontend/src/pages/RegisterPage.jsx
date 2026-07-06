import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../api/customerAuth';
import { extractErrorMessage } from '../api/client';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import Logo from '../components/Logo';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerCustomer(form);
      login(data.token);
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
          <h2>Tao tai khoan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ho ten</label>
              <input value={form.fullName} onChange={handleChange('fullName')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={handleChange('email')} required />
            </div>
            <div className="form-group">
              <label>Mat khau</label>
              <input type="password" minLength={6} value={form.password} onChange={handleChange('password')} required />
            </div>
            <div className="form-group">
              <label>So dien thoai</label>
              <input value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div className="form-group">
              <label>Dia chi</label>
              <input value={form.address} onChange={handleChange('address')} />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn block" type="submit" disabled={loading}>
              {loading ? 'Dang xu ly...' : 'Dang ky'}
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 13 }}>
            Da co tai khoan? <Link to="/login" style={{ color: 'var(--shopee-orange)' }}>Dang nhap</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

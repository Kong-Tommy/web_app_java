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
          <h2>Tạo tài khoản</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ tên</label>
              <input value={form.fullName} onChange={handleChange('fullName')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={handleChange('email')} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" minLength={6} value={form.password} onChange={handleChange('password')} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input value={form.address} onChange={handleChange('address')} />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn block" type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 13 }}>
            Đã có tài khoản? <Link to="/login" style={{ color: 'var(--shopee-orange)' }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

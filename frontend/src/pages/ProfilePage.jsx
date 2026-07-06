import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { updateProfile } from '../api/customerProfile';
import { extractErrorMessage } from '../api/client';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function ProfilePage() {
  const { isLoggedIn, profile, refreshProfile } = useCustomerAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', avatarUrl: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateProfile(form);
      await refreshProfile();
      setSuccess('Cập nhật thông tin thành công.');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page">
      <div className="container auth-shell">
        <div className="card">
          <h2>Thông tin tài khoản</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            {form.avatarUrl ? (
              <img className="avatar-circle large" src={form.avatarUrl} alt="Avatar" />
            ) : (
              <div className="avatar-circle large">{(form.fullName || profile?.email || '?').charAt(0).toUpperCase()}</div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input value={profile?.email || ''} disabled />
            </div>
            <div className="form-group">
              <label>Họ tên</label>
              <input value={form.fullName} onChange={handleChange('fullName')} required minLength={2} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input value={form.phone} onChange={handleChange('phone')} />
            </div>
            <div className="form-group">
              <label>Địa chỉ nhận hàng</label>
              <input value={form.address} onChange={handleChange('address')} />
            </div>
            <div className="form-group">
              <label>Đường dẫn ảnh đại diện (URL)</label>
              <input value={form.avatarUrl} onChange={handleChange('avatarUrl')} placeholder="https://..." />
            </div>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
            <button className="btn block" type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

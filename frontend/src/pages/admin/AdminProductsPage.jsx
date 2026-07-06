import { useEffect, useState } from 'react';
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetCategories,
  adminGetProducts,
  adminUpdateProduct,
} from '../../api/adminProducts';
import { extractErrorMessage } from '../../api/client';
import { useStaffAuth } from '../../context/StaffAuthContext';

const emptyForm = { productName: '', material: '', price: '', quantity: '', categoryId: '', imageUrl: '', releaseDate: '' };

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function AdminProductsPage() {
  const { role } = useStaffAuth();
  const canWrite = role === 'admin' || role === 'manager';
  const canDelete = role === 'admin';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([adminGetProducts(), adminGetCategories()]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.productId);
    setForm({
      productName: p.productName,
      material: p.material || '',
      price: p.price,
      quantity: p.quantity,
      categoryId: p.category?.categoryId || '',
      imageUrl: p.imageUrl || '',
      releaseDate: p.releaseDate || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      productName: form.productName,
      material: form.material,
      price: Number(form.price),
      quantity: Number(form.quantity),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl,
      releaseDate: form.releaseDate || null,
    };
    try {
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
      } else {
        await adminCreateProduct(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await adminDeleteProduct(id);
      await load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="section-title">Quản lý sản phẩm</div>

      {canWrite && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ textAlign: 'left', marginTop: 0 }}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Tên sản phẩm (viết hoa chữ đầu)</label>
              <input value={form.productName} onChange={handleChange('productName')} required />
            </div>
            <div className="form-group">
              <label>Chất liệu</label>
              <input value={form.material} onChange={handleChange('material')} />
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input type="number" step="0.01" min="0.01" value={form.price} onChange={handleChange('price')} required />
            </div>
            <div className="form-group">
              <label>Số lượng</label>
              <input type="number" min="0" value={form.quantity} onChange={handleChange('quantity')} required />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select value={form.categoryId} onChange={handleChange('categoryId')} required>
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ngày ra mắt</label>
              <input type="date" value={form.releaseDate || ''} onChange={handleChange('releaseDate')} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Ảnh (URL)</label>
              <input value={form.imageUrl} onChange={handleChange('imageUrl')} />
            </div>
            {error && <p className="error-text" style={{ gridColumn: '1 / -1' }}>{error}</p>}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button className="btn" type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
              {editingId && <button className="btn outline" type="button" onClick={resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>SL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.productName}</td>
                <td>{p.category?.categoryName}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.quantity}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  {canWrite && <a onClick={() => startEdit(p)}>Sửa</a>}
                  {canDelete && <a onClick={() => handleDelete(p.productId)} style={{ color: 'var(--danger)' }}>Xóa</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

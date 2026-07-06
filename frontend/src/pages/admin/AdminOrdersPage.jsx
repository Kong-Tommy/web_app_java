import { useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/adminProducts';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await adminGetOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await adminUpdateOrderStatus(orderId, status);
    await load();
  };

  return (
    <div>
      <div className="section-title">Quan ly don hang</div>
      {loading ? (
        <p>Dang tai...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ma don</th>
              <th>Khach hang</th>
              <th>Ngay dat</th>
              <th>Tong tien</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>#{o.orderId}</td>
                <td>
                  <div>{o.customerName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                </td>
                <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                <td>{formatPrice(o.totalAmount)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o.orderId, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

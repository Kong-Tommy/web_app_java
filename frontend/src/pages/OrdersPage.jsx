import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

function statusBadgeClass(status) {
  if (status === 'COMPLETED') return 'badge success';
  if (status === 'CANCELLED') return 'badge danger';
  if (status === 'CONFIRMED' || status === 'SHIPPING') return 'badge warning';
  return 'badge';
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="page"><div className="container">Đang tải đơn hàng...</div></main>;
  }

  return (
    <main className="page">
      <div className="container">
        <div className="section-title">Đơn hàng của tôi</div>
        {orders.length === 0 ? (
          <div className="empty-state">Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td>#{o.orderId}</td>
                    <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                    <td><span className={statusBadgeClass(o.status)}>{o.status}</span></td>
                    <td>{formatPrice(o.totalAmount)}</td>
                    <td><Link to={`/orders/${o.orderId}`}>Xem chi tiết</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

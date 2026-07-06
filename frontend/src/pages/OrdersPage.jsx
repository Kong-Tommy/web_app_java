import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
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
    return <main className="page"><div className="container">Dang tai don hang...</div></main>;
  }

  return (
    <main className="page">
      <div className="container">
        <div className="section-title">Don hang cua toi</div>
        {orders.length === 0 ? (
          <div className="empty-state">Ban chua co don hang nao.</div>
        ) : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ma don</th>
                  <th>Ngay dat</th>
                  <th>Trang thai</th>
                  <th>Tong tien</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td>#{o.orderId}</td>
                    <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                    <td><span className="badge">{o.status}</span></td>
                    <td>{formatPrice(o.totalAmount)}</td>
                    <td><Link to={`/orders/${o.orderId}`}>Xem chi tiet</Link></td>
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

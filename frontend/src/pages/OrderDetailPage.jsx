import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMyOrder } from '../api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getMyOrder(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <main className="page"><div className="container">Dang tai...</div></main>;
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="section-title">Don hang #{order.orderId}</div>
        <div className="card">
          <p>Trang thai: <span className="badge">{order.status}</span></p>
          <p>Ngay dat: {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
          <p>Dia chi giao hang: {order.shippingAddress}</p>
          <p>So dien thoai: {order.shippingPhone}</p>

          <table className="admin-table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>San pham</th>
                <th>Gia</th>
                <th>SL</th>
                <th>Thanh tien</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.productId}>
                  <td>{i.productName}</td>
                  <td>{formatPrice(i.price)}</td>
                  <td>{i.quantity}</td>
                  <td>{formatPrice(i.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div>Tong cong: <strong className="price" style={{ fontSize: 20 }}>{formatPrice(order.totalAmount)}</strong></div>
          </div>
        </div>
      </div>
    </main>
  );
}

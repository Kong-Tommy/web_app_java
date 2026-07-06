import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMyOrder } from '../api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

function statusBadgeClass(status) {
  if (status === 'COMPLETED') return 'badge success';
  if (status === 'CANCELLED') return 'badge danger';
  if (status === 'CONFIRMED' || status === 'SHIPPING') return 'badge warning';
  return 'badge';
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getMyOrder(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <main className="page"><div className="container">Đang tải...</div></main>;
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="section-title">Đơn hàng #{order.orderId}</div>
        <div className="card">
          <p>Trạng thái: <span className={statusBadgeClass(order.status)}>{order.status}</span></p>
          <p>Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
          <p>Địa chỉ giao hàng: {order.shippingAddress}</p>
          <p>Số điện thoại: {order.shippingPhone}</p>

          <table className="admin-table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>SL</th>
                <th>Thành tiền</th>
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
            <div>Tổng cộng: <strong className="price" style={{ fontSize: 20 }}>{formatPrice(order.totalAmount)}</strong></div>
          </div>
        </div>
      </div>
    </main>
  );
}

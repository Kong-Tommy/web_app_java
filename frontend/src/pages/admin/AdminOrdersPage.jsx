import { Fragment, useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/adminProducts';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' }).format(price);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (orderId) => {
    setExpandedId((current) => (current === orderId ? null : orderId));
  };

  return (
    <div>
      <div className="section-title">Quản lý đơn hàng</div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <Fragment key={o.orderId}>
                <tr>
                  <td>#{o.orderId}</td>
                  <td>
                    <div>{o.customerName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                  </td>
                  <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span>{formatPrice(o.totalAmount)}</span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(o.orderId)}
                        title="Xem sản phẩm đã mua"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          transform: expandedId === o.orderId ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s',
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td>
                    <select value={o.status} onChange={(e) => handleStatusChange(o.orderId, e.target.value)}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expandedId === o.orderId && (
                  <tr>
                    <td colSpan={5} style={{ background: '#fafafa' }}>
                      <div style={{ padding: '8px 12px', textAlign: 'left' }}>
                        {o.items.map((item) => (
                          <div
                            key={item.productId}
                            style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}
                          >
                            <span>{item.productName} x{item.quantity}</span>
                            <span>{formatPrice(item.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

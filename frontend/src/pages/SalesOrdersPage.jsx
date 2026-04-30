import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SalesOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (err) {
      setError('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stored = localStorage.getItem('cutes-user');
  const user = stored ? JSON.parse(stored) : null;
  const isAdmin = user?.role === 'ADMIN';

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      setSuccess(`Status updated to ${newStatus} for order ${orderId}`);
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setSuccess(`Order ${orderId} deleted successfully.`);
      setOrders(orders.filter(o => o.orderId !== orderId));
    } catch (err) {
      setError('Failed to delete order.');
    }
  };

  return (
    <div className="w-full space-y-6 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Order Management</p>
          <h2 className="text-3xl font-semibold text-slate-950">Sales Orders</h2>
        </div>
        <button
          onClick={() => navigate('/sales/orders/add')}
          className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300"
        >
          Add New Order
        </button>
      </div>

      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}
      {success && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{success}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Required Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Packing Type</th>
              <th className="px-6 py-4">Box Price</th>
              <th className="px-6 py-4">Total Items</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-4 text-center">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-950">{order.orderId}</td>
                  <td className="px-6 py-4">{order.requiredDate}</td>
                  <td className="px-6 py-4">
                    {isAdmin ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className="rounded-3xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 outline-none transition focus:border-brand"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SEND">SEND</option>
                      </select>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'PACKED' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{order.packingType}</td>
                  <td className="px-6 py-4">{order.boxPrice ? `$${order.boxPrice.toFixed(2)}` : 'N/A'}</td>
                  <td className="px-6 py-4">{order.orderItems?.length || 0}</td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'PENDING' || isAdmin ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/sales/orders/edit/${order.orderId}`)}
                          className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.orderId)}
                          className="font-semibold text-rose-600 hover:text-rose-800"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400">Locked</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesOrdersPage;

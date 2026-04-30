import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SalesOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-grow">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
          {dateFilter && (
            <button 
              onClick={() => setDateFilter('')}
              className="p-3 text-slate-400 hover:text-rose-500 transition"
              title="Clear date filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

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
            ) : (() => {
              const filteredOrders = orders.filter(o => {
                const matchesSearch = o.orderId.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDate = !dateFilter || o.requiredDate === dateFilter;
                return matchesSearch && matchesDate;
              });

              if (filteredOrders.length === 0) {
                return <tr><td colSpan="7" className="px-6 py-4 text-center">No orders found.</td></tr>;
              }

              return filteredOrders.map((order) => (
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
              ));
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesOrdersPage;

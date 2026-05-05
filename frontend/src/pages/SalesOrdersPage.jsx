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
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING, PACKED, SEND
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [packedByFilter, setPackedByFilter] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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
        {!isAdmin && (
          <button
            onClick={() => navigate('/sales/orders/add')}
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300"
          >
            Add New Order
          </button>
        )}
      </div>

      {(isAdmin || user?.role === 'SALES_MANAGEMENT') && (
        <div className="flex gap-4 border-b border-slate-200">
          {['ALL', 'PENDING', 'PACKED', 'SEND'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold transition ${activeTab === tab
                ? 'border-b-2 border-brand text-slate-950'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab === 'SEND' ? 'Sent' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {tab === 'ALL' ? orders.length : orders.filter(o => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      )}

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
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Created By:</span>
            <select
              value={createdByFilter}
              onChange={(e) => setCreatedByFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 cursor-pointer"
            >
              <option value="">All Staff</option>
              {[...new Set(orders.map(o => o.createdBy).filter(Boolean))].map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Packed By:</span>
            <select
              value={packedByFilter}
              onChange={(e) => setPackedByFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 cursor-pointer"
            >
              <option value="">All Staff</option>
              {[...new Set(orders.map(o => o.packedBy).filter(Boolean))].map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 cursor-pointer"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="p-3 text-slate-400 hover:text-rose-500 transition"
                title="Clear date filter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Required Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : (() => {
              const filteredOrders = orders.filter(o => {
                const matchesSearch = o.orderId.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDate = !dateFilter || o.requiredDate === dateFilter;
                const matchesTab = activeTab === 'ALL' || o.status === activeTab;
                const matchesCreatedBy = !createdByFilter || o.createdBy === createdByFilter;
                const matchesPackedBy = !packedByFilter || o.packedBy === packedByFilter;
                return matchesSearch && matchesDate && matchesTab && matchesCreatedBy && matchesPackedBy;
              });

              if (filteredOrders.length === 0) {
                return <tr><td colSpan="5" className="px-6 py-4 text-center">No orders found.</td></tr>;
              }

              return filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-950">{order.orderId}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{order.customerName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">{order.requiredDate}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'PACKED' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Rs. {(
                      (order.orderItems?.reduce((sum, item) => sum + item.totalPrice, 0) || 0) + 
                      (order.boxPrice || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setExpandedOrderId(order.orderId)}
                        className="font-semibold text-slate-600 hover:text-slate-900"
                      >
                        View
                      </button>
                      {order.status === 'PENDING' && !isAdmin && (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {expandedOrderId && (() => {
        const order = orders.find(o => o.orderId === expandedOrderId);
        if (!order) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setExpandedOrderId(null)}>
            <div
              className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">Order Details</p>
                  <h3 className="text-2xl font-bold text-slate-950">{order.orderId}</h3>
                </div>
                <button
                  onClick={() => setExpandedOrderId(null)}
                  className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* 1. Staff Accountability (Smaller) */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 px-5">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sales:</p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center text-brand text-[10px] font-bold">
                        {order.createdBy?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{order.createdBy || 'Unknown'}</p>
                    </div>
                  </div>
                  {order.packedBy && (
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Packed:</p>
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                          {order.packedBy?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <p className="text-sm font-semibold text-slate-700">{order.packedBy}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Items List */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-950 mb-4">Order Items</h4>
                  <div className="grid gap-3">
                    {order.orderItems?.map(item => (
                      <div key={item.id} className="flex items-center gap-5 rounded-2xl border border-slate-100 p-4 shadow-sm shadow-slate-100/50">
                        <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                          {item.itemImage ? (
                            <img src={item.itemImage} alt={item.itemTitle} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-slate-950 text-lg">{item.itemCode} - {item.itemTitle}</p>
                          <div className="flex gap-6 text-sm text-slate-600 mt-2 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg items-center">
                            <span className="flex items-center gap-1.5">
                              Color:
                              {item.color && item.color !== 'N/A' && (
                                <span className="w-3 h-3 rounded-full border border-slate-300 inline-block shadow-sm" style={{ backgroundColor: item.color === 'Default' ? '#94a3b8' : item.color }}></span>
                              )}
                              {!item.color?.startsWith('#') && (
                                <span className="font-bold text-slate-950">{item.color || 'N/A'}</span>
                              )}
                            </span>
                            <span>Qty: <span className="font-bold text-slate-950">{item.quantity}</span></span>
                          </div>
                        </div>
                        <div className="text-right text-xl font-bold text-slate-950">
                          Rs. {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Packing Details, Box Price, and Grand Total */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Packing Type</p>
                        <p className="text-lg font-bold text-slate-950">{order.packingType}</p>
                      </div>
                      {order.boxPrice != null && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Box Price</p>
                          <p className="text-lg font-bold text-slate-950">Rs. {order.boxPrice.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center items-end border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
                      <p className="text-sm text-slate-500 font-semibold mb-1">Grand Total</p>
                      <p className="text-4xl font-black text-brand">
                        Rs. {(
                          (order.orderItems?.reduce((sum, item) => sum + item.totalPrice, 0) || 0) + 
                          (order.boxPrice || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Message */}
                {order.message && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Message</p>
                    <p className="text-slate-950 leading-relaxed italic">"{order.message}"</p>
                  </div>
                )}

                {/* 3.5 Customer Information (Moved up for better visibility) */}
                {(order.customerName || order.customerAddress || order.customerPhone1) && (
                  <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-brand/10 pb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Customer Information</h4>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Customer Name</p>
                          <p className="text-lg font-bold text-slate-950">{order.customerName || 'Not Provided'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Contact Numbers</p>
                          <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center rounded-full bg-white border border-brand/20 px-3 py-1 text-sm font-bold text-brand">
                              {order.customerPhone1 || 'N/A'}
                            </span>
                            {order.customerPhone2 && (
                              <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600">
                                {order.customerPhone2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-brand/5">
                          {order.customerAddress || 'No address provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Courier Details */}
                {(order.status === 'PACKED' || order.status === 'SEND') && order.courierName && (
                  <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-brand/20 bg-brand/5 p-5">
                    <div>
                      <p className="text-xs text-brand/80 font-semibold uppercase tracking-wider mb-1">Courier Name</p>
                      <p className={`text-xl font-bold text-slate-950`}>{order.courierName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand/80 font-semibold uppercase tracking-wider mb-1">Tracking Number</p>
                      <p className="text-xl font-semibold text-slate-950">{order.courierNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default SalesOrdersPage;

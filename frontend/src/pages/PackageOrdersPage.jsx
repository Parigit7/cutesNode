import { useEffect, useState } from 'react';
import api from '../services/api';

function PackageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, PACKED, SEND

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Status Update State
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [courierNameType, setCourierNameType] = useState('Prompt');
  const [customCourierName, setCustomCourierName] = useState('');
  const [courierNumber, setCourierNumber] = useState('');
  
  const stored = localStorage.getItem('cutes-user');
  const user = stored ? JSON.parse(stored) : null;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
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

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus) return;

    const order = orders.find(o => o.orderId === orderId);
    let finalCourierName = '';
    let finalCourierNumber = '';

    // If order is currently PENDING, we must enter courier details regardless of new status
    if (order?.status === 'PENDING') {
      finalCourierName = courierNameType === 'Other' ? customCourierName : courierNameType;
      if (!finalCourierName.trim()) {
        alert("Please provide a valid courier name.");
        return;
      }
      if (!courierNumber.trim()) {
        alert("Please provide the courier number.");
        return;
      }
      finalCourierNumber = courierNumber;
    }

    setStatusUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        courierName: finalCourierName || order.courierName,
        courierNumber: courierNumber || order.courierNumber
      });

      // Update local state
      setOrders(orders.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            status: newStatus,
            courierName: o.status === 'PENDING' ? finalCourierName : o.courierName,
            courierNumber: o.status === 'PENDING' ? finalCourierNumber : o.courierNumber
          };
        }
        return o;
      }));

      setExpandedOrderId(null);
      setNewStatus('');
      setCourierNameType('Prompt');
      setCustomCourierName('');
      setCourierNumber('');
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      setNewStatus('');
      setCourierNameType('Prompt');
      setCustomCourierName('');
      setCourierNumber('');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = o.status === activeTab;
    const matchesSearch = o.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || o.requiredDate === dateFilter;
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getCourierColor = (name) => {
    if (name === 'Prompt') return 'text-blue-600 font-bold';
    if (name === 'Fardar') return 'text-red-600 font-bold';
    return 'text-slate-950 font-bold';
  };

  return (
    <div className="w-full space-y-6 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Package Management</p>
        <h2 className="text-3xl font-semibold text-slate-950">Package Orders</h2>
      </div>

      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <div className="flex flex-col gap-6 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-4">
          {['PENDING', 'PACKED', 'SEND'].map(tab => (
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
                {orders.filter(o => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>

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
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-slate-500 py-8">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No {activeTab.toLowerCase()} orders found.</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.orderId} className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div
                onClick={() => toggleExpand(order.orderId)}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</p>
                    <p className="font-semibold text-slate-950">{order.orderId}</p>
                    <p className="text-[10px] text-brand font-bold uppercase">{order.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Required Date</p>
                    <p className="text-slate-950">{order.requiredDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {order.courierName && (order.status === 'PACKED' || order.status === 'SEND') && (
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className={getCourierColor(order.courierName)}>{order.courierName}</span>
                      <span className="text-slate-500">: {order.courierNumber}</span>
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'PACKED' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {order.status}
                  </span>
                  <button className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {expandedOrderId && (() => {
        const order = orders.find(o => o.orderId === expandedOrderId);
        if (!order) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => toggleExpand(null)}>
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
                  onClick={() => toggleExpand(null)}
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
                                <span className="w-3 h-3 rounded-full border border-slate-300 inline-block shadow-sm" style={{ backgroundColor: item.color }}></span>
                              )}
                              <span className="font-bold text-slate-950">{item.color || 'N/A'}</span>
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
                      <p className={`text-xl ${getCourierColor(order.courierName)}`}>{order.courierName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand/80 font-semibold uppercase tracking-wider mb-1">Tracking Number</p>
                      <p className="text-xl font-semibold text-slate-950">{order.courierNumber}</p>
                    </div>
                  </div>
                )}

                {/* Update Status Controls */}
                <div className="rounded-[1.5rem] border border-brand/20 bg-brand/5 p-6 space-y-5">
                  <h4 className="text-lg font-semibold text-brand">Update Order Status</h4>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      New Status
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand shadow-sm"
                      >
                        <option value="">Select Status...</option>
                        {order.status === 'PENDING' && <option value="PACKED">PACKED</option>}
                        {(order.status === 'PENDING' || order.status === 'PACKED') && <option value="SEND">SEND</option>}
                      </select>
                    </label>

                    {order.status === 'PENDING' && newStatus && (
                      <>
                        <label className="grid gap-2 text-sm font-medium text-slate-700">
                          Courier Name
                          <select
                            value={courierNameType}
                            onChange={(e) => setCourierNameType(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand shadow-sm"
                          >
                            <option value="Prompt">Prompt</option>
                            <option value="Fardar">Fardar</option>
                            <option value="Other">Other (Write Custom)</option>
                          </select>
                        </label>

                        {courierNameType === 'Other' && (
                          <label className="grid gap-2 text-sm font-medium text-slate-700">
                            Custom Courier
                            <input
                              type="text"
                              value={customCourierName}
                              onChange={(e) => setCustomCourierName(e.target.value)}
                              placeholder="Enter courier name"
                              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand shadow-sm"
                            />
                          </label>
                        )}

                        <label className="grid gap-2 text-sm font-medium text-slate-700">
                          Courier Number
                          <input
                            type="text"
                            value={courierNumber}
                            onChange={(e) => setCourierNumber(e.target.value)}
                            placeholder="Tracking No."
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand shadow-sm"
                          />
                        </label>
                      </>
                    )}
                  </div>

                  {newStatus && (
                    <button
                      onClick={() => handleUpdateStatus(order.orderId)}
                      disabled={statusUpdating}
                      className="w-full sm:w-auto mt-4 rounded-xl bg-slate-950 px-8 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800 disabled:opacity-50 shadow-md shadow-slate-900/20"
                    >
                      {statusUpdating ? 'Updating...' : `Confirm update to ${newStatus}`}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default PackageOrdersPage;

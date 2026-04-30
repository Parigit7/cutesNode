import { useEffect, useState } from 'react';
import api from '../services/api';

function PackageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, PACKED, SEND
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Status Update State
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [courierNameType, setCourierNameType] = useState('Prompt');
  const [customCourierName, setCustomCourierName] = useState('');
  const [courierNumber, setCourierNumber] = useState('');

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
        courierName: finalCourierName,
        courierNumber: courierNumber
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

  const filteredOrders = orders.filter(o => o.status === activeTab);

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

      <div className="flex gap-4 border-b border-slate-200">
        {['PENDING', 'PACKED', 'SEND'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold transition ${
              activeTab === tab 
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
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Required Date</p>
                    <p className="text-slate-950">{order.requiredDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items</p>
                    <p className="text-slate-950">{order.orderItems?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {order.courierName && (order.status === 'PACKED' || order.status === 'SEND') && (
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className={getCourierColor(order.courierName)}>{order.courierName}</span>
                      <span className="text-slate-500">: {order.courierNumber}</span>
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'PACKED' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transition-transform ${expandedOrderId === order.orderId ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {expandedOrderId === order.orderId && (
                <div className="border-t border-slate-200 bg-white p-5 space-y-6">
                  
                  {/* Order Meta Info */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Packing Type</p>
                      <p className="font-semibold text-slate-950">{order.packingType}</p>
                    </div>
                    {order.boxPrice != null && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Box Price</p>
                        <p className="font-semibold text-slate-950">${order.boxPrice.toFixed(2)}</p>
                      </div>
                    )}
                    {order.message && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                        <p className="text-xs text-slate-500">Message</p>
                        <p className="font-semibold text-slate-950">{order.message}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Courier Info for Packed and Sent Orders */}
                  {(order.status === 'PACKED' || order.status === 'SEND') && order.courierName && (
                    <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-brand/20 bg-brand/5 p-4">
                      <div>
                        <p className="text-xs text-brand/80 font-semibold uppercase tracking-wider">Courier Name</p>
                        <p className={`text-lg ${getCourierColor(order.courierName)}`}>{order.courierName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand/80 font-semibold uppercase tracking-wider">Tracking Number</p>
                        <p className="text-lg font-semibold text-slate-950">{order.courierNumber}</p>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div>
                    <h4 className="font-semibold text-slate-950 mb-3">Order Items</h4>
                    <div className="grid gap-3">
                      {order.orderItems?.map(item => (
                        <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3">
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                            {item.itemImage ? (
                              <img src={item.itemImage} alt={item.itemTitle} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No Img</div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-slate-950">{item.itemCode} - {item.itemTitle}</p>
                            <div className="flex gap-4 text-sm text-slate-600 mt-1">
                              <span>Color: <span className="font-medium text-slate-950">{item.color || 'N/A'}</span></span>
                              <span>Qty: <span className="font-medium text-slate-950">{item.quantity}</span></span>
                            </div>
                          </div>
                          <div className="text-right font-semibold text-brand">
                            ${item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Update Status Controls */}
                  <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5 space-y-4">
                    <h4 className="font-semibold text-brand">Update Order Status</h4>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="grid gap-2 text-sm text-slate-600">
                        New Status
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="rounded-3xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand"
                        >
                          <option value="">Select Status...</option>
                          {order.status === 'PENDING' && <option value="PACKED">PACKED</option>}
                          {(order.status === 'PENDING' || order.status === 'PACKED') && <option value="SEND">SEND</option>}
                        </select>
                      </label>

                      {order.status === 'PENDING' && newStatus && (
                        <>
                          <label className="grid gap-2 text-sm text-slate-600">
                            Courier Name
                            <select
                              value={courierNameType}
                              onChange={(e) => setCourierNameType(e.target.value)}
                              className="rounded-3xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand"
                            >
                              <option value="Prompt">Prompt</option>
                              <option value="Fardar">Fardar</option>
                              <option value="Other">Other (Write Custom)</option>
                            </select>
                          </label>

                          {courierNameType === 'Other' && (
                            <label className="grid gap-2 text-sm text-slate-600">
                              Custom Courier
                              <input
                                type="text"
                                value={customCourierName}
                                onChange={(e) => setCustomCourierName(e.target.value)}
                                placeholder="Enter courier name"
                                className="rounded-3xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand"
                              />
                            </label>
                          )}

                          <label className="grid gap-2 text-sm text-slate-600">
                            Courier Number
                            <input
                              type="text"
                              value={courierNumber}
                              onChange={(e) => setCourierNumber(e.target.value)}
                              placeholder="Tracking No."
                              className="rounded-3xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand"
                            />
                          </label>
                        </>
                      )}
                    </div>

                    {newStatus && (
                      <button
                        onClick={() => handleUpdateStatus(order.orderId)}
                        disabled={statusUpdating}
                        className="rounded-full bg-slate-950 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        {statusUpdating ? 'Updating...' : `Confirm update to ${newStatus}`}
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PackageOrdersPage;

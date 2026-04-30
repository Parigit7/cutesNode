import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function AddOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [orderId, setOrderId] = useState(id || '');
  const [packingType, setPackingType] = useState('No box');
  const [boxPrice, setBoxPrice] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone1, setCustomerPhone1] = useState('');
  const [customerPhone2, setCustomerPhone2] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchCode, setSearchCode] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
    if (isEditing) {
      loadOrder(id);
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [cats, itms] = await Promise.all([api.get('/categories'), api.get('/items')]);
      setCategories(cats.data || []);
      setItems(itms.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrder = async (orderId) => {
    try {
      const { data } = await api.get('/orders');
      const order = data.find(o => o.orderId === orderId);
      if (order) {
        setPackingType(order.packingType);
        setBoxPrice(order.boxPrice || '');
        setRequiredDate(order.requiredDate);
        setMessage(order.message || '');
        setCustomerName(order.customerName || '');
        setCustomerAddress(order.customerAddress || '');
        setCustomerPhone1(order.customerPhone1 || '');
        setCustomerPhone2(order.customerPhone2 || '');
        setOrderItems(order.orderItems || []);
      } else {
        setError('Order not found.');
      }
    } catch (err) {
      setError('Failed to load order.');
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCat = searchCategory === 'All' || item.category === searchCategory;
      const matchCode = item.code.toLowerCase().includes(searchCode.toLowerCase());
      return matchCat && matchCode;
    });
  }, [items, searchCategory, searchCode]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSelectedColor(item.colors && item.colors.length > 0 ? item.colors[0].name : '');
    setQuantity(1);
  };

  const handleAddItemToOrder = () => {
    if (!selectedItem) return;
    if (!quantity || quantity <= 0) return;

    const qty = parseInt(quantity, 10);
    const totalPrice = qty * selectedItem.price;

    const newItem = {
      itemId: selectedItem.id,
      itemCode: selectedItem.code,
      itemTitle: selectedItem.title,
      color: selectedColor,
      quantity: qty,
      totalPrice: totalPrice,
      itemPrice: selectedItem.price // to show in UI
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedItem(null);
    setSearchCode('');
    setQuantity('');
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!orderId) return setError('Order ID is required.');
    if (!requiredDate) return setError('Required Date is required.');
    if (!customerName) return setError('Customer Name is required.');
    if (!customerAddress) return setError('Customer Address is required.');
    if (!customerPhone1) return setError('Primary Phone Number is required.');
    if (orderItems.length === 0) return setError('Please add at least one item.');

    const payload = {
      orderId,
      packingType,
      boxPrice: boxPrice ? parseFloat(boxPrice) : null,
      requiredDate,
      message,
      status: 'PENDING',
      customerName,
      customerAddress,
      customerPhone1,
      customerPhone2,
      orderItems
    };

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/orders/${orderId}`, payload);
        setSuccess('Order updated successfully.');
      } else {
        await api.post('/orders', payload);
        setSuccess('Order created successfully.');
        // Reset form
        setOrderId('');
        setPackingType('No box');
        setBoxPrice('');
        setRequiredDate('');
        setMessage('');
        setCustomerName('');
        setCustomerAddress('');
        setCustomerPhone1('');
        setCustomerPhone2('');
        setOrderItems([]);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Order ID already exists.');
      } else {
        setError('Failed to save order.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">{isEditing ? 'Edit Order' : 'New Order'}</p>
          <h2 className="text-3xl font-semibold text-slate-950">{isEditing ? `Order ${orderId}` : 'Create a New Order'}</h2>
        </div>
        <button
          onClick={() => navigate('/sales')}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          Back to Orders
        </button>
      </div>

      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}
      {success && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{success}</div>}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Add Items to Order */}
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-950">Add Items</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id || c.code} value={c.name}>{c.name}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search item code..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
            {filteredItems.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">No items found.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-slate-950">{item.code} - {item.title}</p>
                      <p className="text-xs text-slate-500">Rs. {item.price.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedItem && (
            <div className="space-y-4 rounded-2xl border border-brand/20 bg-brand/5 p-4">
              <h4 className="font-semibold text-brand">Selected: {selectedItem.title} ({selectedItem.code})</h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedItem.colors && selectedItem.colors.length > 0 && (
                  <div className="grid gap-2 text-sm text-slate-600">
                    <span>Color</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedItem.colors.map(c => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`h-8 w-8 rounded-full border-2 transition-all ${
                            selectedColor === c.name ? 'border-slate-900 scale-125 shadow-md' : 'border-slate-200 hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.name }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <label className="grid gap-2 text-sm text-slate-600">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="font-semibold text-slate-950">
                  Total: Rs. {(selectedItem.price * (parseInt(quantity) || 0)).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={handleAddItemToOrder}
                  disabled={!quantity || quantity <= 0}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                >
                  Add to Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Details */}
        <form onSubmit={handleSaveOrder} className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-950">Order Details</h3>
          
          <label className="grid gap-2 text-sm text-slate-600">
            Order ID (Primary Key)
            <input
              required
              disabled={isEditing}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="e.g. ORD-001"
            />
          </label>

          <div className="grid gap-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Customer Details</h4>
            
            <label className="grid gap-2 text-sm text-slate-600">
              Customer Name *
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Full name"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              Delivery Address *
              <textarea
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                rows="3"
                placeholder="Complete address for delivery"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Phone Number 1 *
                <input
                  required
                  type="tel"
                  value={customerPhone1}
                  onChange={(e) => setCustomerPhone1(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="07X XXXXXXX"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Phone Number 2
                <input
                  type="tel"
                  value={customerPhone2}
                  onChange={(e) => setCustomerPhone2(e.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Optional"
                />
              </label>
            </div>
          </div>

          <label className="grid gap-2 text-sm text-slate-600">
            Required Date
            <input
              type="date"
              required
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 text-sm text-slate-600">
              <span>Packing Type</span>
              <div className="flex flex-col gap-2">
                {['No box', 'White box', 'Brown box'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="packingType"
                      value={type}
                      checked={packingType === type}
                      onChange={(e) => setPackingType(e.target.value)}
                      className="text-brand focus:ring-brand"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="grid gap-2 text-sm text-slate-600">
              Box Price (Optional)
              <input
                type="number"
                step="0.01"
                min="0"
                value={boxPrice}
                onChange={(e) => setBoxPrice(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="0.00"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-slate-600">
            Message (Optional)
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              rows="2"
            />
          </label>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-950">Order Items ({orderItems.length})</h4>
            {orderItems.length === 0 ? (
              <p className="text-sm text-slate-500">No items added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {orderItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <p className="font-semibold">{item.itemCode}</p>
                      <p className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {item.color && item.color !== 'N/A' && (
                          <span className="w-3 h-3 rounded-full border border-slate-300 inline-block shadow-sm" style={{ backgroundColor: item.color }}></span>
                        )}
                        <span>{item.color} x {item.quantity}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Rs. {item.totalPrice.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="text-right text-lg font-bold text-slate-950">
              Grand Total: Rs. { (orderItems.reduce((acc, curr) => acc + curr.totalPrice, 0) + (parseFloat(boxPrice) || 0)).toFixed(2) }
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-950 px-6 py-4 text-center font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Order' : 'Save Order (Pending)')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOrderPage;

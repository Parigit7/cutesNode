import { useEffect, useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function StoreItemsPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await api.get('/items');
        if (Array.isArray(response.data)) {
          setItems(response.data);
        }
      } catch (err) {
        setError('Unable to load store items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const availableItems = useMemo(() => {
    return items.filter(item => {
      // Logic: At least one color has quantity > 0
      const isAvailable = item.colors?.some(c => c.qty > 0);

      const matchesSearch = item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

      return isAvailable && matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const categories = useMemo(() => {
    return ['All', ...new Set(items.map(item => item.category))];
  }, [items]);

  // Track quantity for each item
  const [qtyMap, setQtyMap] = useState({});

  const handleQtyChange = (id, value) => {
    setQtyMap((prev) => ({ ...prev, [id]: Math.max(1, Number(value) || 1) }));
  };

  const handleAddToCart = (item) => {
    const qty = qtyMap[item.id] || 1;
    addToCart(item, qty);
    setQtyMap((prev) => ({ ...prev, [item.id]: 1 }));
    // Optionally show a message or toast here
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-[#a53973]/10 border-t-[#a53973]" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-sans text-slate-700 overflow-x-hidden">
      {/* High-Fidelity Ultra-Modern Header Section - Compact */}
      <section className="relative w-full px-6 py-10 md:px-12 md:py-16 bg-[#fffafb] overflow-hidden flex flex-col items-center justify-center">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#a53973]/10 rounded-full blur-[140px] animate-pulse duration-[12000ms]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-pink-200/40 rounded-full blur-[140px] animate-pulse duration-[15000ms]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          {/* Professional Glassmorphism Container */}
          <div className="relative w-full max-w-3xl rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/80 p-8 md:p-12 shadow-[0_32px_120px_-20px_rgba(165,57,115,0.15)] flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_48px_140px_-25px_rgba(165,57,115,0.22)] hover:-translate-y-1 group">

            {/* Cute Decorative Accent */}
            <div className="absolute -top-4 -left-4 h-12 w-12 rounded-2xl bg-[#a53973] shadow-2xl shadow-[#a53973]/30 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white shadow-lg shadow-pink-500/5 border border-slate-50 mb-8 animate-in fade-in slide-in-from-bottom-4">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#a53973] animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a53973]/60">Hand-Picked with Love</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#a53973] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[0.85]">
              Explore our <br />
              <span className="bg-gradient-to-r from-[#a53973] via-pink-500 to-[#a53973] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Gift Shop</span>
            </h1>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              <p className="max-w-xl text-xl md:text-2xl text-slate-700 font-black tracking-tight leading-tight">
                Beautifully curated items <br className="hidden md:block" /> for your special moments.
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-pink-200" />
                <p className="text-sm md:text-base text-slate-400 font-bold tracking-wide italic">
                  Hand-picked with love and delivered with care.
                </p>
                <span className="h-px w-8 bg-pink-200" />
              </div>
            </div>

            {/* Bottom Accent Decor */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full bg-[#a53973] opacity-${(3 - i) * 20}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="w-full px-6 py-16 md:px-12 max-w-[1920px] mx-auto space-y-12">
        {/* Store Inventory Section */}


        {/* Professional Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-80">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none pr-4 border-r border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#a53973]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none rounded-[1.5rem] border border-slate-100 bg-white py-4 pl-28 pr-12 text-sm font-bold text-slate-900 outline-none transition focus:ring-4 focus:ring-[#a53973]/5 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="relative flex-grow w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full rounded-[1.5rem] border border-slate-100 bg-white py-4 pl-16 pr-8 text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none transition focus:ring-4 focus:ring-[#a53973]/5"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 p-6 text-center text-rose-600 border border-rose-100 font-semibold">
            {error}
          </div>
        )}

        {/* Items Grid - Keeping existing Card UI as requested */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {availableItems.length === 0 ? (
            <div className="col-span-full rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/30 py-24 text-center">
              <div className="text-6xl mb-4 opacity-20">🛍️</div>
              <p className="text-xl font-bold text-slate-400">No items found matching your criteria.</p>
              <button
                onClick={() => { setSearch(''); setCategoryFilter('All'); }}
                className="mt-6 text-[#a53973] font-black text-[10px] uppercase tracking-[0.4em] hover:opacity-70 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            availableItems.map((item, index) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-64 overflow-hidden bg-slate-50 cursor-pointer" onClick={() => setSelectedImage(item.image)}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/30 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                      Click to view full image
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#a53973] shadow-lg">
                      In Stock
                    </span>
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 group-hover:text-[#a53973] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                        <p className="text-2xl font-black text-slate-950">Rs. {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        value={qtyMap[item.id] || 1}
                        onChange={e => handleQtyChange(item.id, e.target.value)}
                        className="w-16 rounded-xl border border-slate-200 px-2 py-1 text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#a53973]/20"
                      />
                      <button
                        className="rounded-xl bg-[#a53973] text-white font-bold px-4 py-2 hover:bg-[#a53973]/90 transition-all"
                        onClick={() => handleAddToCart(item)}
                        type="button"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 text-white backdrop-blur-md transition hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="h-full w-full max-h-[85vh] rounded-[1.5rem] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreItemsPage;

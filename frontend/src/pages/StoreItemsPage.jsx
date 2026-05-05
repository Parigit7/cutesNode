import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';

function StoreItemsPage() {
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Public Catalog</p>
          <h2 className="text-4xl font-bold text-slate-950 tracking-tight">Store Inventory</h2>
          <p className="max-w-2xl text-slate-500 font-medium leading-relaxed">
            Discover our collection of available items. All items shown are currently in stock and ready for your order.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 shadow-sm sm:grid-cols-2">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or item code..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-6 text-center text-rose-600 border border-rose-100 font-semibold">
          {error}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {availableItems.length === 0 ? (
          <div className="col-span-full rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/30 py-20 text-center">
            <div className="text-4xl mb-4 opacity-50">🛍️</div>
            <p className="text-lg font-bold text-slate-400">No available items found matching your criteria.</p>
          </div>
        ) : (
          availableItems.map((item) => (
            <article 
              key={item.id} 
              onClick={() => setSelectedImage(item.image)}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-slate-50">
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
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand shadow-lg">
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
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                    <p className="text-2xl font-black text-slate-950">Rs. {item.price.toFixed(2)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-brand/5 flex items-center justify-center text-brand transition-colors group-hover:bg-brand group-hover:text-white shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/50 text-white backdrop-blur-md transition hover:bg-slate-900"
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

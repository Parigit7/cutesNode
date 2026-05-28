import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

function SalesItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (Array.isArray(response.data) && response.data.length) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Could not load categories from backend', error);
    }
  };

  const loadItems = async () => {
    try {
      const response = await api.get('/items');
      if (Array.isArray(response.data)) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Could not load items from backend', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = item.code.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, category, search]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const categoryOptions = ['All', ...categories.map((cat) => cat.name)];

  return (
    <div className="w-full space-y-6 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Item catalog</p>
          <h2 className="text-3xl font-semibold text-slate-950">View inventory items</h2>
          <p className="max-w-2xl text-slate-600">
            Browse products by category and search by item code.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:grid-cols-2">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by item code"
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {categoryOptions.map((catName) => (
            <option key={catName} value={catName}>
              {catName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No items found for that category or item code.
          </div>
        ) : (
          paginatedItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.category}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">{item.code}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl font-semibold text-slate-950">Rs. {item.price.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  {item.colors.map((color, index) => (
                    <div key={`${item.code}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-sm">
                      <div className="flex items-center gap-3">
                        <span 
                          className="h-4 w-4 rounded-full border border-slate-200 shadow-sm" 
                          style={{ backgroundColor: color.name === 'Default' ? '#94a3b8' : color.name }} 
                          title={color.name}
                        />
                        {!color.name.startsWith('#') && (
                          <span className="font-semibold text-slate-900">{color.name}</span>
                        )}
                      </div>
                      <span className="font-bold text-brand bg-brand/5 px-2.5 py-1 rounded-lg text-xs">
                        {color.qty} <span className="text-[10px] opacity-70">QTY</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Brand-Styled Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100 mt-12">
          <span className="text-sm font-bold text-slate-500">
            Showing <span className="text-brand">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-brand">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-brand">{totalItems}</span> items
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                if (totalPages > 6 && pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                  if (pageNum === 2 && currentPage > 3) return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isActive
                      ? 'bg-brand text-slate-950 shadow-md shadow-brand/20'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesItemsPage;

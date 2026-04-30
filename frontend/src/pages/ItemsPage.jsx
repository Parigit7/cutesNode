import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const initialItems = [
  {
    id: 1,
    code: 'HR001',
    title: 'Classic Hair Brush',
    category: 'HAIR ITEMS',
    price: 15.99,
    colors: [
      { name: 'Default', qty: 10 },
    ],
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    code: 'MG001',
    title: 'Modern Ceramic Mug',
    category: 'MUGS',
    price: 12.99,
    colors: [
      { name: 'Blue', qty: 8 },
      { name: 'White', qty: 5 },
    ],
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb8b8170a8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    code: 'GF001',
    title: 'Premium Gift Pack',
    category: 'Gift Pack',
    price: 34.99,
    colors: [
      { name: 'Default', qty: 20 },
    ],
    image: 'https://images.unsplash.com/photo-1529516545188-36e14bff2f2a?auto=format&fit=crop&w=800&q=80',
  },
];

const initialCategories = [
  { name: 'Gift Pack', code: 'GF' },
  { name: 'Birthday cards', code: 'BR' },
  { name: 'HAIR ITEMS', code: 'HR' },
  { name: 'MUGS', code: 'MG' },
  { name: 'PURFUME', code: 'PF' },
  { name: 'SOFT TOY', code: 'ST' },
  { name: 'WALLETS', code: 'WL' },
  { name: 'WATER BOTTLE', code: 'WT' },
  { name: 'DRESS', code: 'DR' },
  { name: 'JEWELLER', code: 'JW' },
  { name: 'MAKEUP ITEM', code: 'MK' },
  { name: 'STATIONARY', code: 'SN' },
  { name: 'KEY TAGS', code: 'KE' },
];

function ItemsPage() {
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategories[0].name);
  const [defaultQty, setDefaultQty] = useState('');
  const [colorRows, setColorRows] = useState([{ color: '#d59ca3', qty: '' }]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryCode, setNewCategoryCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      if (Array.isArray(response.data) && response.data.length) {
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

  const nextItemCode = useMemo(() => {
    const selected = categories.find((cat) => cat.name === selectedCategory);
    const categoryCode = selected?.code || 'IT';
    const existingCount = items.filter((item) => item.code.startsWith(categoryCode)).length;
    const nextValue = String(existingCount + 1).padStart(3, '0');
    return `${categoryCode}${nextValue}`;
  }, [selectedCategory, categories, items]);

  const categoryOptions = ['All', ...categories.map((cat) => cat.name)];

  const handleAddColorRow = () => {
    setColorRows((prev) => [...prev, { color: '#d59ca3', qty: '' }]);
  };

  const handleColorChange = (index, field, value) => {
    setColorRows((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  };

  const handleImageUpload = (file) => {
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleAddCategory = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategoryName.trim() || !newCategoryCode.trim()) {
      setError('Category name and code are required.');
      return;
    }

    const existing = categories.some(
      (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase() || cat.code.toUpperCase() === newCategoryCode.trim().toUpperCase()
    );

    if (existing) {
      setError('Category name or code already exists.');
      return;
    }

    try {
      const response = await api.post('/categories', {
        name: newCategoryName.trim(),
        code: newCategoryCode.trim().toUpperCase(),
      });

      const createdCategory = response.data;
      setCategories((prev) => [
        ...prev,
        createdCategory,
      ]);
      setSelectedCategory(createdCategory.name);
      setNewCategoryName('');
      setNewCategoryCode('');
      setSuccess('Category added successfully.');
    } catch (error) {
      console.error('Category save failed', error);
      setError('Unable to save category. Please try again.');
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !price || Number(price) <= 0) {
      setError('Please enter a valid item title and price.');
      return;
    }

    const selectedCat = categories.find((cat) => cat.name === selectedCategory);
    if (!selectedCat) {
      setError('Please select a valid category.');
      return;
    }

    const colorDetails = colorRows
      .filter((row) => row.qty && Number(row.qty) > 0)
      .map((row) => ({ name: row.color.toUpperCase(), qty: Number(row.qty) }));

    if (!colorDetails.length && !defaultQty) {
      setError('Add at least one color quantity or a default quantity.');
      return;
    }

    const parsedDefaultQty = Number(defaultQty);
    const colors = [...colorDetails];
    if (parsedDefaultQty > 0) {
      colors.unshift({ name: 'Default', qty: parsedDefaultQty });
    }

    const payload = {
      code: nextItemCode,
      title: title.trim(),
      category: selectedCategory,
      categoryCode: selectedCat.code,
      price: Number(price),
      image: imagePreview || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      colors,
    };

    try {
      const response = await api.post('/items', payload);
      const savedItem = response.data;
      setItems((prev) => [savedItem, ...prev]);
      setTitle('');
      setImageFile(null);
      setImagePreview('');
      setPrice('');
      setDefaultQty('');
      setColorRows([{ color: '#d59ca3', qty: '' }]);
      setSuccess(`Item ${savedItem.code} added successfully.`);
      setShowForm(false);
    } catch (error) {
      console.error('Item save failed', error);
      setError('Unable to save item. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 rounded-[2rem] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Item catalog</p>
          <h2 className="text-3xl font-semibold text-slate-950">All inventory items</h2>
          <p className="max-w-2xl text-slate-600">
            Browse products by category, search by item code, and manage inventory with new item creation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((value) => !value);
            setError('');
            setSuccess('');
          }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="text-xl">+</span>
          Add new item
        </button>
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

      {showForm && (
        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Item title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Enter item title"
                />
              </label>
              <div className="grid gap-2 text-sm text-slate-600">
                <span>Upload image</span>
                <label className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition hover:border-brand hover:text-brand">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event.target.files?.[0])}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span className="text-sm font-semibold">Choose file</span>
                </label>
              </div>
            </div>
            {imagePreview && (
              <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-sm font-semibold text-slate-700">Image preview</p>
                <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="0.00"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Category
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.name}>
                      {cat.name} ({cat.code})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Quantity without color
                <input
                  type="number"
                  min="0"
                  value={defaultQty}
                  onChange={(event) => setDefaultQty(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="e.g. 10"
                />
              </label>
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm((value) => !value)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-brand hover:bg-brand/10"
                >
                  {showCategoryForm ? 'Hide category form' : 'Add category'}
                </button>
                <span className="text-xs text-slate-500">New category code is used for new item codes.</span>
              </div>
            </div>

            {showCategoryForm && (
              <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-600">
                    Category name
                    <input
                      value={newCategoryName}
                      onChange={(event) => setNewCategoryName(event.target.value)}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      placeholder="HR, BR, etc."
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    Category code
                    <input
                      value={newCategoryCode}
                      onChange={(event) => setNewCategoryCode(event.target.value)}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      placeholder="Two-letter code"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300"
                >
                  Save category
                </button>
              </div>
            )}

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Color quantities</p>
                <button
                  type="button"
                  onClick={handleAddColorRow}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  + Add color
                </button>
              </div>
              <div className="grid gap-4">
                {colorRows.map((row, index) => (
                  <div key={index} className="grid gap-4 sm:grid-cols-[auto_1fr_auto] items-end">
                    <label className="grid gap-2 text-sm text-slate-600">
                      Color picker
                      <input
                        type="color"
                        value={row.color}
                        onChange={(event) => handleColorChange(index, 'color', event.target.value)}
                        className="h-12 w-full cursor-pointer rounded-3xl border border-slate-200 bg-white p-2"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Quantity
                      <input
                        type="number"
                        min="0"
                        value={row.qty}
                        onChange={(event) => handleColorChange(index, 'qty', event.target.value)}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                        placeholder="e.g. 7"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{row.color}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                Item code will be generated as <span className="font-semibold text-slate-900">{nextItemCode}</span>.
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300"
              >
                Save item
              </button>
            </div>

            {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}
            {success && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{success}</div>}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No items found for that category or item code.
          </div>
        ) : (
          filteredItems.map((item) => (
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
                  <span className="text-2xl font-semibold text-slate-950">${item.price.toFixed(2)}</span>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">In stock</span>
                </div>

                <div className="space-y-3">
                  {item.colors.map((color, index) => (
                    <div key={`${item.code}-${index}`} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: color.name === 'Default' ? '#94a3b8' : color.name }} />
                        <span className="font-semibold text-slate-900">{color.name}</span>
                      </div>
                      <span className="text-slate-600">{color.qty} pcs</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default ItemsPage;

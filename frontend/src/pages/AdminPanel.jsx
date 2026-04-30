import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [currentUserName, setCurrentUserName] = useState('Admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('SALES_MANAGEMENT');
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('cutes-user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserName(user.username || 'Admin');
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Unable to load users. Please login with an admin account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingUserId) {
        const { data } = await api.post('/users/update', {
          id: editingUserId,
          username,
          password: password || undefined,
          role,
          active,
        });
        setMessage(`Updated ${data.role} user: ${data.username}`);
      } else {
        const { data } = await api.post('/users', {
          username,
          password,
          role,
          active,
        });
        setMessage(`Created ${data.role} user: ${data.username}`);
      }
      
      setEditingUserId(null);
      setUsername('');
      setPassword('');
      setRole('SALES_MANAGEMENT');
      setActive(true);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${editingUserId ? 'update' : 'create'} user.`);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setPassword('');
    setRole(user.role);
    setActive(user.active);
    setError('');
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setUsername('');
    setPassword('');
    setRole('SALES_MANAGEMENT');
    setActive(true);
    setError('');
    setMessage('');
  };

  return (
    <div className="w-full space-y-6 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Admin panel</p>
        <h2 className="text-3xl font-semibold text-slate-950">Manage your team members</h2>
        <p className="max-w-2xl text-slate-600">
          Welcome back, <span className="font-semibold text-slate-950">{currentUserName}</span>. You are now on the admin dashboard.
          Admin accounts can add new sales and package management employees. New users receive a starter password of{' '}
          <span className="font-semibold text-slate-950">password123</span>.
        </p>
      </div>

      {message && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{message}</div>}
      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-950">{editingUserId ? 'Edit user' : 'Create new user'}</h3>
          <label className="grid gap-2 text-sm text-slate-600">
            New user username
            <input
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            Password {editingUserId && <span className="text-xs text-slate-400">(Leave blank to keep current)</span>}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 pr-12"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required={!editingUserId}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            Role
            <select
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={role}
              onChange={(event) => setRole(event.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="SALES_MANAGEMENT">Sales Management</option>
              <option value="PACKAGE">Package Management</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            Active
            <select
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={active ? 'true' : 'false'}
              onChange={(event) => setActive(event.target.value === 'true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300">
              {editingUserId ? 'Update user' : 'Create user'}
            </button>
            {editingUserId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-950">User directory</h3>
          {loading ? (
            <p className="text-slate-600">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-slate-600">No users found or you do not have permission.</p>
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/80">
                  <div>
                    <p className="font-semibold text-slate-950">{user.username}</p>
                    <p className="text-sm text-slate-600">Role: {user.role}</p>
                    <p className="text-sm text-slate-600">Status: {user.active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <button
                    onClick={() => handleEditClick(user)}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

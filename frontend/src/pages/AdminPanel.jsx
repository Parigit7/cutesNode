import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [currentUserName, setCurrentUserName] = useState('Admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES_MANAGEMENT');
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/users', {
        username,
        password,
        role,
        active,
      });
      setMessage(`Created ${data.role} user: ${data.username}`);
      setUsername('');
      setPassword('');
      setRole('SALES_MANAGEMENT');
      setActive(true);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user.');
    }
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
        <form onSubmit={handleCreate} className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
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
            Password
            <input
              type="password"
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
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

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300">
            Create user
          </button>
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
                <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/80">
                  <p className="font-semibold text-slate-950">{user.username}</p>
                  <p className="text-sm text-slate-600">Role: {user.role}</p>
                  <p className="text-sm text-slate-600">Status: {user.active ? 'Active' : 'Inactive'}</p>
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

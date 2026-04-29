import { useEffect, useState } from 'react';
import api from '../services/api';

function EmployeesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES');
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Unable to load employees. Please login as an admin.');
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
      setMessage(`Created ${data.role} user ${data.username}`);
      setUsername('');
      setPassword('');
      setRole('SALES');
      setActive(true);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 rounded-[2rem] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Employees</p>
          <h2 className="text-3xl font-semibold text-slate-950">All employee accounts</h2>
          <p className="max-w-2xl text-slate-600">View current employees and add new team members with role and active status.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="text-xl">+</span>
          {showForm ? 'Close form' : 'Add employee'}
        </button>
      </div>

      {message && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{message}</div>}
      {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="grid gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Username
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
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Role
              <select
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="ADMIN">Admin</option>
                <option value="SALES">Sales Management</option>
                <option value="PACKAGE">Package Management</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Active status
              <select
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={active ? 'true' : 'false'}
                onChange={(event) => setActive(event.target.value === 'true')}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>

          <div className="flex items-center justify-end">
            <button className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300">
              Create employee
            </button>
          </div>
        </form>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-slate-700">
            <thead>
              <tr>
                <th className="pb-4 font-semibold text-slate-900">Username</th>
                <th className="pb-4 font-semibold text-slate-900">Role</th>
                <th className="pb-4 font-semibold text-slate-900">Password</th>
                <th className="pb-4 font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">Loading employees...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                    <td className="px-4 py-4 font-semibold text-slate-900">{user.username}</td>
                    <td className="px-4 py-4 text-slate-600">{user.role}</td>
                    <td className="px-4 py-4 text-slate-600">••••••••</td>
                    <td className="px-4 py-4 text-slate-600">{user.active ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default EmployeesPage;

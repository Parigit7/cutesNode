import { useEffect, useState } from 'react';
import api from '../services/api';

function EmployeesPage() {
  const [users, setUsers] = useState([]);
  const [passwordByUserId, setPasswordByUserId] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES');
  const [active, setActive] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
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
      setPasswordByUserId((prev) => {
        const next = { ...prev };
        data.forEach((user) => {
          if (!Object.prototype.hasOwnProperty.call(next, user.id)) {
            next[user.id] = '';
          }
        });
        return next;
      });
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
      setPasswordByUserId((prev) => ({ ...prev, [data.id]: password }));
      setUsername('');
      setPassword('');
      setRole('SALES');
      setActive(true);
      setShowPassword(false);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee.');
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setPassword(passwordByUserId[user.id] || '');
    setRole(user.role);
    setActive(user.active);
    setShowEditPassword(false);
    setShowEditModal(true);
    setError('');
    setMessage('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingUserId) return;

    setError('');
    setMessage('');
    try {
      await api.post('/users/update', {
        id: editingUserId,
        username,
        password,
        role,
        active,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                username,
                role,
                active,
              }
            : user
        )
      );
      if (password) {
        setPasswordByUserId((prev) => ({ ...prev, [editingUserId]: password }));
      }
      setMessage('Employee updated successfully.');
      setShowEditModal(false);
      setEditingUserId(null);
      setUsername('');
      setPassword('');
      setRole('SALES');
      setActive(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee.');
    }
  };

  return (
    <div className="w-full space-y-6 rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
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
        <form onSubmit={handleCreate} className="grid gap-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
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
            <div className="grid gap-2 text-sm text-slate-600">
              <span>Password</span>
              <div className="relative">
                <input
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
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
                <th className="pb-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Loading employees...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                    <td className="px-4 py-4 font-semibold text-slate-900">{user.username}</td>
                    <td className="px-4 py-4 text-slate-600">{user.role}</td>
                    <td className="px-4 py-4 text-slate-600">{passwordByUserId[user.id] || 'Not set'}</td>
                    <td className="px-4 py-4 text-slate-600">{user.active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand hover:bg-brand/10"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-950">Edit employee</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-5">
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
                <div className="grid gap-2 text-sm text-slate-600">
                  <span>Password</span>
                  <div className="relative">
                    <input
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                      type={showEditPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Leave as is or enter a new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      aria-label={showEditPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
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
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;

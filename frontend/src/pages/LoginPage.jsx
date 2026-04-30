import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('cutes-user', JSON.stringify(data));
      setMessage(`Welcome back, ${data.username}. Role: ${data.role}`);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.role === 'SALES_MANAGEMENT') {
        navigate('/sales');
      } else if (data.role === 'PACKAGE') {
        navigate('/package');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="w-full rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-shrink-0">
        <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full">
          <img src="/logo.png" alt="Cutes.lk Logo" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex-grow space-y-6">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Secure login</p>
          <h2 className="text-3xl font-semibold text-slate-950">Sign in to Cutes.lk</h2>
          <p className="max-w-md text-slate-600">
            Access your dashboard to manage items, employees, and sales orders effectively.
          </p>
        </div>

        {message && <div className="rounded-3xl bg-brand/10 p-4 text-sm text-brand">{message}</div>}
        {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="grid gap-2 text-sm text-slate-600">
            Username
            <input
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-600">
            Password
            <input
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

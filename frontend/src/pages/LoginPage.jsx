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
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Secure login</p>
        <h2 className="text-3xl font-semibold text-slate-950">Sign in to Cutes.lk</h2>
        <p className="max-w-2xl text-slate-600">
          Use the seeded admin account to get started. After login, you can add sales and package management team members.
        </p>
      </div>

      {message && <div className="mt-6 rounded-3xl bg-brand/10 p-4 text-sm text-brand">{message}</div>}
      {error && <div className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm text-slate-600">
          Username
          <input
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
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
            placeholder="admin123"
            required
          />
        </label>

        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

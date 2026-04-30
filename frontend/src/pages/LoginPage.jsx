import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('cutes-user', JSON.stringify(data));

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
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-brand/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/80 border border-white shadow-[0_32px_64px_-16px_rgba(165,57,115,0.15)] rounded-[2.5rem] p-8 md:p-12 space-y-10">

          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Login</h2>
            <p className="text-slate-500 font-medium">Welcome back to Cutes.lk management</p>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className="rounded-2xl bg-brand/5 border border-brand/10 p-4 text-sm text-brand text-center font-bold animate-in fade-in zoom-in duration-300">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
              <input
                className="w-full rounded-2xl border border-slate-100 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand/30 focus:bg-white transition-all duration-300 placeholder:text-slate-300 font-medium"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-100 px-5 py-4 bg-white/50 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand/30 focus:bg-white transition-all duration-300 placeholder:text-slate-300 font-medium"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full rounded-2xl bg-brand text-white font-bold py-4 transition-all duration-500 hover:bg-brand/90 hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(165,57,115,0.4)] disabled:opacity-50 disabled:scale-100 overflow-hidden"
            >
              <span className={`relative z-10 flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign In
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Branding */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-slate-100" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Powered by Cutes.lk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

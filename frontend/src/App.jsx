import { Link, useNavigate, Outlet } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const stored = typeof window !== 'undefined' ? localStorage.getItem('cutes-user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;
  const isAdminLoggedIn = currentUser?.role === 'ADMIN';

  const handleAdminLogout = () => {
    localStorage.removeItem('cutes-user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white text-2xl font-black">
              C
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Cutes.lk</h1>
              <p className="text-slate-500">Business management made simple</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm transition hover:border-slate-300 hover:text-slate-950"
              >
                Home
              </button>
            ) : (
              <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/">
                Home
              </Link>
            )}

            {isAdminLoggedIn ? (
              <>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/admin/items">
                  Items
                </Link>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/admin/employees">
                  Employees
                </Link>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/admin">
                  Orders
                </Link>
              </>
            ) : (
              <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/login">
                Login
              </Link>
            )}
            {currentUser && <span className="ml-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700">{currentUser.username}</span>}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <main>
          <Outlet />
        </main>

        <footer className="mt-12 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Cutes.lk
        </footer>
      </div>
    </div>
  );
}

export default App;

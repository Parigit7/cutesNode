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
      <header className="w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-2 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <img src="/logo.png" alt="Cutes.lk Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Cutes.lk</h1>
              <p className="text-slate-500 text-sm">Business management made simple</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm transition hover:border-slate-300 hover:text-slate-950"
              >
                Logout
              </button>
            ) : currentUser?.role === 'SALES_MANAGEMENT' || currentUser?.role === 'PACKAGE' ? (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm transition hover:border-slate-300 hover:text-slate-950"
              >
                Logout
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
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/admin">
                  Employees
                </Link>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/sales">
                  Orders
                </Link>
              </>
            ) : currentUser?.role === 'SALES_MANAGEMENT' ? (
              <>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/sales/items">
                  View Items
                </Link>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/sales">
                  Orders
                </Link>
              </>
            ) : currentUser?.role === 'PACKAGE' ? (
              <>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/package/items">
                  View Items
                </Link>
                <Link className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-slate-300 hover:text-slate-950" to="/package">
                  Package Orders
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

      <div className="w-full px-4 py-4 lg:px-8">
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

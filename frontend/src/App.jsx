import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stored = typeof window !== 'undefined' ? localStorage.getItem('cutes-user') : null;
  const currentUser = stored ? JSON.parse(stored) : null;
  const isAdminLoggedIn = currentUser?.role === 'ADMIN';

  const handleAdminLogout = () => {
    localStorage.removeItem('cutes-user');
    setIsMenuOpen(false);
    navigate('/');
  };

  const getPortalName = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin Portal';
      case 'SALES_MANAGEMENT': return 'Sales Management Portal';
      case 'PACKAGE': return 'Package Management Portal';
      default: return 'User Portal';
    }
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [];
  if (isAdminLoggedIn) {
    navLinks.push(
      { name: 'Items', path: '/admin/items' },
      { name: 'Employees', path: '/admin' },
      { name: 'Orders', path: '/sales' }
    );
  } else if (currentUser?.role === 'SALES_MANAGEMENT') {
    navLinks.push(
      { name: 'View Items', path: '/sales/items' },
      { name: 'Orders', path: '/sales' }
    );
  } else if (currentUser?.role === 'PACKAGE') {
    navLinks.push(
      { name: 'View Items', path: '/package/items' },
      { name: 'Package Orders', path: '/package' }
    );
  } else {
    navLinks.push(
      { name: 'Home', path: '/' },
      { name: 'Login', path: '/login' }
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-2 lg:px-8">
          <Link to="/" className="flex items-center hover:opacity-90 transition py-1">
            <div className="h-16 w-16 md:h-28 md:w-28 flex items-center justify-center p-1">
              <img src="/logo.png" alt="Cutes.lk Logo" className="h-full w-full object-contain" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isActive
                    ? 'bg-[#a53973] text-white shadow-md shadow-[#a53973]/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {currentUser && (
              <div className="ml-4 flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-[#a53973] uppercase tracking-[0.15em] leading-none mb-1.5">
                    {getPortalName(currentUser.role)}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{currentUser.username}</span>
                  <button
                    onClick={handleAdminLogout}
                    className="text-[10px] font-bold text-rose-500 uppercase hover:text-rose-600 transition mt-0.5"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 md:hidden items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between rounded-xl px-5 py-4 text-sm font-bold transition ${location.pathname === link.path
                    ? 'bg-[#a53973]/10 text-[#a53973]'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && <div className="h-1.5 w-1.5 rounded-full bg-[#a53973]" />}
                </Link>
              ))}
              {currentUser && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between px-5 mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#a53973] uppercase tracking-[0.15em] leading-none mb-1.5">
                        {getPortalName(currentUser.role)}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{currentUser.username}</span>
                    </div>
                    <button
                      onClick={handleAdminLogout}
                      className="rounded-full bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="w-full px-4 py-4 lg:px-8">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;

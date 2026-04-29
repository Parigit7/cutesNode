import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 rounded-[2rem] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Cutes.lk dashboard</p>
          <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">Modern business management for retail, sales, and package teams.</h1>
          <p className="max-w-2xl text-slate-600 leading-8">
            Manage user access, assign roles and keep your small business workflow in sync with a clean, modern UI.
            Start with admin login, then create sales and package management accounts easily.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="inline-flex rounded-full bg-brand px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-pink-300" to="/login">
              Login now
            </Link>
            <a className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-7 py-3 text-sm text-slate-700 transition hover:border-brand hover:text-brand" href="#roles">
              See roles
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-lg shadow-slate-200/70">
          <div className="space-y-4">
            <div className="rounded-[1.8rem] bg-slate-100 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Fast role-based control</h2>
              <p className="mt-3 text-slate-600">Build a strong team with admin, sales, and package management access all under one dashboard.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-lg font-semibold text-slate-950">Admin</p>
                <p className="mt-2 text-slate-600">Create users, assign roles, and manage your team securely.</p>
              </div>
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <p className="text-lg font-semibold text-slate-950">Sales Management</p>
                <p className="mt-2 text-slate-600">Track customer orders and stay aligned with admin controls.</p>
              </div>
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 sm:col-span-2">
                <p className="text-lg font-semibold text-slate-950">Package Management</p>
                <p className="mt-2 text-slate-600">Coordinate deliveries with a clean, reliable workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

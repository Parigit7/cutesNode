import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import EmployeesPage from './pages/EmployeesPage';
import ItemsPage from './pages/ItemsPage';
import RequireAdmin from './components/RequireAdmin';
import RequireSales from './components/RequireSales';
import SalesOrdersPage from './pages/SalesOrdersPage';
import AddOrderPage from './pages/AddOrderPage';
import SalesItemsPage from './pages/SalesItemsPage';
import RequirePackage from './components/RequirePackage';
import PackageOrdersPage from './pages/PackageOrdersPage';
import './index.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'admin', element: <RequireAdmin><AdminPanel /></RequireAdmin> },
        { path: 'admin/items', element: <RequireAdmin><ItemsPage /></RequireAdmin> },
        { path: 'admin/employees', element: <RequireAdmin><EmployeesPage /></RequireAdmin> },
        { path: 'sales', element: <RequireSales><SalesOrdersPage /></RequireSales> },
        { path: 'sales/items', element: <RequireSales><SalesItemsPage /></RequireSales> },
        { path: 'sales/orders/add', element: <RequireSales><AddOrderPage /></RequireSales> },
        { path: 'sales/orders/edit/:id', element: <RequireSales><AddOrderPage /></RequireSales> },
        { path: 'package', element: <RequirePackage><PackageOrdersPage /></RequirePackage> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

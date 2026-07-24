import { createBrowserRouter, Navigate } from 'react-router-dom';
import ChartMapRoutes from './ChartMapRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import OtherRoutes from './OtherRoutes';
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import TablesRoutes from './TablesRoutes';
import PurchaseOrderRoutes from './PurchaseOrderRoutes';
import YarnPurchaseRoutes from './YarnPurchaseRoutes';
import AccessoriesPurchaseRoutes from './AccessoriesPurchaseRoutes';
import DyingKnittingRoutes from './DyingKnittingRoutes';
import EmbroideryRoutes from './EmbroideryRoutes';
import QCRoutes from './QCRoutes';
import PackingRoutes from './PackingRoutes';
import SettingsRoutes from './SettingsRoutes';
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';
import UsersList from 'views/user-management/UsersList';
import Login from 'views/auth/login/Login';

// ✅ CORRECT PATH - Dashboard
import Dashboard from 'views/navigation/dashboard/Default';

// ✅ Reports Imports
const PurchaseOrderReport = Loadable(lazy(() => import('views/Reports/PurchaseOrderReport')));
const YarnPurchaseReport = Loadable(lazy(() => import('views/Reports/YarnPurchaseReport')));
const AccessoriesPurchaseReport = Loadable(lazy(() => import('views/Reports/AccessoriesPurchaseReport')));
const KnittingReport = Loadable(lazy(() => import('views/Reports/KnittingReport')));
const DyingReport = Loadable(lazy(() => import('views/Reports/DyingReport')));
const EmbroideryReport = Loadable(lazy(() => import('views/Reports/EmbroideryReport')));
const QCReport = Loadable(lazy(() => import('views/Reports/QCReport')));
const PackingReport = Loadable(lazy(() => import('views/Reports/PackingReport')));

const UserRole = Loadable(
  lazy(() => import('views/user-role/UserRole'))
);

const AddUserManual = Loadable(
  lazy(() => import('views/user-management/AddUserManual'))
);

const router = createBrowserRouter(
  [
    // ✅ LOGIN ROUTE
    {
      path: '/login',
      element: <Login />
    },
    // ✅ REGISTER ROUTE
    {
      path: '/register',
      element: <Login />
    },
    // ✅ MAIN PROTECTED ROUTES (DashboardLayout ke ANDAR)
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        // ✅ Dashboard
        {
          path: '',
          element: <Navigate to="/dashboard" replace />
        },
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        // ✅ User Management
        {
          path: 'user-role',
          element: <UserRole />
        },
        {
          path: 'user-role/edit/:id',
          element: <UserRole />
        },
        {
          path: 'add-user-manual',
          element: <AddUserManual />
        },
        {
          path: 'user-management/list',
          element: <UsersList />
        },
        // ✅ ALL REPORTS - DashboardLayout ke ANDAR
        {
          path: 'reports',
          children: [
            { path: 'purchase-order', element: <PurchaseOrderReport /> },
            { path: 'yarn-purchase', element: <YarnPurchaseReport /> },
            { path: 'accessories-purchase', element: <AccessoriesPurchaseReport /> },
            { path: 'knitting', element: <KnittingReport /> },
            { path: 'dying', element: <DyingReport /> },
            { path: 'embroidery', element: <EmbroideryReport /> },
            { path: 'qc', element: <QCReport /> },
            { path: 'packing', element: <PackingReport /> }
          ]
        }
      ]
    },
    // ✅ OTHER ROUTES (Without DashboardLayout)
    NavigationRoutes,
    ComponentsRoutes,
    FormsRoutes,
    TablesRoutes,
    PurchaseOrderRoutes,
    YarnPurchaseRoutes,
    AccessoriesPurchaseRoutes,
    DyingKnittingRoutes,
    EmbroideryRoutes,
    QCRoutes,
    PackingRoutes,
    SettingsRoutes,
    PagesRoutes,
    OtherRoutes,
    ChartMapRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
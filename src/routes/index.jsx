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
import Dashboard from 'views/navigation/dashboard/Default';
import Unauthorized from 'views/Unauthorized';

const PurchaseOrderReport = Loadable(lazy(() => import('views/Reports/PurchaseOrderReport')));
const YarnPurchaseReport = Loadable(lazy(() => import('views/Reports/YarnPurchaseReport')));
const AccessoriesPurchaseReport = Loadable(lazy(() => import('views/Reports/AccessoriesPurchaseReport')));
const KnittingReport = Loadable(lazy(() => import('views/Reports/KnittingReport')));
const DyingReport = Loadable(lazy(() => import('views/Reports/DyingReport')));
const EmbroideryReport = Loadable(lazy(() => import('views/Reports/EmbroideryReport')));
const QCReport = Loadable(lazy(() => import('views/Reports/QCReport')));
const PackingReport = Loadable(lazy(() => import('views/Reports/PackingReport')));

const UserRole = Loadable(lazy(() => import('views/user-role/UserRole')));
const AddUserManual = Loadable(lazy(() => import('views/user-management/AddUserManual')));
const PurchaseOrderList = Loadable(lazy(() => import('views/purchase-order/PurchaseOrderList')));
const AddPurchaseOrder = Loadable(lazy(() => import('views/purchase-order/AddPurchaseOrder')));
const ClientList = Loadable(lazy(() => import('views/client/ClientList')));
const AddClient = Loadable(lazy(() => import('views/client/AddClient')));
const PackingSent = Loadable(lazy(() => import('views/Packing/PackingSent')));
const PackingReceived = Loadable(lazy(() => import('views/Packing/PackingReceived')));
const PackingList = PackingReceived;

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Login />
    },
    {
      path: '/unauthorized',
      element: <Unauthorized />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: <Navigate to="/dashboard" replace />
        },
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'purchase-order/list',
          element: (
            <ProtectedRoute requiredRole="Purchase Order">
              <PurchaseOrderList />
            </ProtectedRoute>
          )
        },
        {
          path: 'purchase-order/add',
          element: (
            <ProtectedRoute requiredRole="Purchase Order">
              <AddPurchaseOrder />
            </ProtectedRoute>
          )
        },
        {
          path: 'purchase-order/edit/:id',
          element: (
            <ProtectedRoute requiredRole="Purchase Order">
              <AddPurchaseOrder />
            </ProtectedRoute>
          )
        },
        {
          path: 'purchase-order/view/:id',
          element: (
            <ProtectedRoute requiredRole="Purchase Order">
              <PurchaseOrderList />
            </ProtectedRoute>
          )
        },
        {
          path: 'yarn-purchase/*',
          element: (
            <ProtectedRoute requiredRole={['Yarn Purchase', 'Procurement']}>
              <YarnPurchaseRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'accessories-purchase/*',
          element: (
            <ProtectedRoute requiredRole={['Accessories Purchase', 'Procurement']}>
              <AccessoriesPurchaseRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'knitting/*',
          element: (
            <ProtectedRoute requiredRole="Knitting">
              <DyingKnittingRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'dying/*',
          element: (
            <ProtectedRoute requiredRole="Dying">
              <DyingKnittingRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'embroidery/*',
          element: (
            <ProtectedRoute requiredRole="Embroidery">
              <EmbroideryRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'qc/*',
          element: (
            <ProtectedRoute requiredRole="QC">
              <QCRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'packing',
          children: [
            {
              path: '',
              element: <Navigate to="/packing/list" replace />  // ✅ ADD THIS
            },
            {
              path: 'sent',
              element: <PackingSent />
            },
            {
              path: 'list',
              element: <PackingList />
            },
            {
              path: 'received',
              element: <PackingReceived />
            },
            {
              path: 'edit/:id',
              element: <PackingSent />
            }
          ]
        },
        {
          path: 'client/list',
          element: (
            <ProtectedRoute requiredRole={['Admin', 'Client']}>
              <ClientList />
            </ProtectedRoute>
          )
        },
        {
          path: 'client/add',
          element: (
            <ProtectedRoute requiredRole={['Admin', 'Client']}>
              <AddClient />
            </ProtectedRoute>
          )
        },
        {
          path: 'client/edit/:id',
          element: (
            <ProtectedRoute requiredRole={['Admin', 'Client']}>
              <AddClient />
            </ProtectedRoute>
          )
        },
        {
          path: 'settings/*',
          element: (
            <ProtectedRoute>
              <SettingsRoutes />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-role',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UserRole />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-role/edit/:id',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UserRole />
            </ProtectedRoute>
          )
        },
        {
          path: 'add-user-manual',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <AddUserManual />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-management/list',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UsersList />
            </ProtectedRoute>
          )
        },
        {
          path: 'reports',
          children: [
            {
              path: 'purchase-order',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <PurchaseOrderReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'yarn-purchase',
              element: (
                <ProtectedRoute requiredRole={['Yarn Purchase', 'Procurement']}>
                  <YarnPurchaseReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'accessories-purchase',
              element: (
                <ProtectedRoute requiredRole={['Accessories Purchase', 'Procurement']}>
                  <AccessoriesPurchaseReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'knitting',
              element: (
                <ProtectedRoute requiredRole="Knitting">
                  <KnittingReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'dying',
              element: (
                <ProtectedRoute requiredRole="Dying">
                  <DyingReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'embroidery',
              element: (
                <ProtectedRoute requiredRole="Embroidery">
                  <EmbroideryReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'qc',
              element: (
                <ProtectedRoute requiredRole="QC">
                  <QCReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'packing',
              element: (
                <ProtectedRoute requiredRole="Packing">
                  <PackingReport />
                </ProtectedRoute>
              )
            }
          ]
        }
      ]
    },
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
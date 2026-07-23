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

const UserRole = Loadable(
  lazy(() => import('views/user-role/UserRole'))
);

const AddUserManual = Loadable(
  lazy(() => import('views/user-management/AddUserManual'))
);

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />
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
          element: <div>Dashboard Page</div>
        },
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
        }
      ]
    },
    PagesRoutes,
    OtherRoutes,
    ChartMapRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
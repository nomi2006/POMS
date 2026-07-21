import { createBrowserRouter } from 'react-router-dom';

// project-imports
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

// ✅ UserRole aur AddUserManual ko Loadable ke saath import karein
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

const UserRole = Loadable(
  lazy(() => import('views/user-role/UserRole'))
);

const AddUserManual = Loadable(
  lazy(() => import('views/user-management/AddUserManual'))
);

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
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
    // ✅ UserRole Routes
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
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
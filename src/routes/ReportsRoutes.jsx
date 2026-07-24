import { lazy } from 'react';
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const PurchaseOrderReport = Loadable(
  lazy(() => import('views/Reports/PurchaseOrderReport'))
);

const ReportsRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'reports/purchase-order',
          element: <PurchaseOrderReport />
        }
      ]
    }
  ]
};

export default ReportsRoutes;
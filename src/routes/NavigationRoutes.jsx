import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

const DefaultPages = Loadable(
  lazy(() => import('views/navigation/dashboard/Default'))
);

const NavigationRoutes = {
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
          path: '/',
          element: <DefaultPages />
        }
      ]
    }
  ]
};
export default NavigationRoutes;
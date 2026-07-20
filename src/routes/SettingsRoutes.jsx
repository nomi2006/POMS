import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const Settings = Loadable(
  lazy(() => import('views/settings/Settings'))
);

const SettingsRoutes = {
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
          path: 'settings',
          element: <Settings />
        }
      ]
    }
  ]
};

export default SettingsRoutes;
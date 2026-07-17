import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const PackingSent = Loadable(
  lazy(() => import('views/Packing/PackingSent'))
);

const PackingReceived = Loadable(
  lazy(() => import('views/Packing/PackingReceived'))
);

const PackingRoutes = {
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
          path: 'packing',
          children: [
            {
              path: 'sent',
              element: <PackingSent />
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
        }
      ]
    }
  ]
};

export default PackingRoutes;
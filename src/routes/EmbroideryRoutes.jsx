import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const EmbroiderySent = Loadable(
  lazy(() => import('views/Embroidery/EmbroiderySent'))
);

const EmbroideryReceived = Loadable(
  lazy(() => import('views/Embroidery/EmbroideryReceived'))
);

const EmbroideryRoutes = {
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
          path: 'embroidery',
          children: [
            {
              path: 'sent',
              element: <EmbroiderySent />
            },
            {
              path: 'received',
              element: <EmbroideryReceived />
            },
            {
              path: 'edit/:id',
              element: <EmbroiderySent />
            }
          ]
        }
      ]
    }
  ]
};

export default EmbroideryRoutes;
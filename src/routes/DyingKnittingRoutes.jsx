import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

// Knitting
const KnittingSent = Loadable(
  lazy(() => import('views/Knitting/KnittingSent'))
);

const KnittingReceived = Loadable(
  lazy(() => import('views/Knitting/KnittingReceived'))
);

// Dying
const DyingSent = Loadable(
  lazy(() => import('views/Dying/DyingSent'))
);

const DyingReceived = Loadable(
  lazy(() => import('views/Dying/DyingReceived'))
);

const DyingKnittingRoutes = {
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
        // Knitting Routes
        {
          path: 'knitting',
          children: [
            {
              path: 'sent',
              element: <KnittingSent />
            },
            {
              path: 'received',
              element: <KnittingReceived />
            },
            {
              path: 'edit/:id',
              element: <KnittingSent />
            }
          ]
        },
        // Dying Routes
        {
          path: 'dying',
          children: [
            {
              path: 'sent',
              element: <DyingSent />
            },
            {
              path: 'received',
              element: <DyingReceived />
            },
            {
              path: 'edit/:id',
              element: <DyingSent />
            }
          ]
        }
      ]
    }
  ]
};

export default DyingKnittingRoutes;
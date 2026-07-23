import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

// Knitting
const KnittingSent = Loadable(
  lazy(() => import('views/Knitting/KnittingSent'))
);
const KnittingRSentList = Loadable(
  lazy(() => import('views/Knitting/KnittingSentList'))
);
const KnittingReceived = Loadable(
  lazy(() => import('views/Knitting/KnittingReceived'))
);

// Dying
const DyingSent = Loadable(
  lazy(() => import('views/Dying/DyingSent'))
);
const DyingSentList = Loadable(
  lazy(() => import('views/Dying/DyingSentList'))
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
              path: 'sent-list',
              element: <KnittingRSentList />
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
              path: 'sent-list',
              element: <DyingSentList />
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
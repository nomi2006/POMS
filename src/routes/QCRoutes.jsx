import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const QCSent = Loadable(
  lazy(() => import('views/QC/QCSent'))
);

const QCReceived = Loadable(
  lazy(() => import('views/QC/QCReceived'))
);

const QCRoutes = {
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
          path: 'qc',
          children: [
            {
              path: 'sent',
              element: <QCSent />
            },
            {
              path: 'received',
              element: <QCReceived />
            },
            {
              path: 'edit/:id',
              element: <QCSent />
            }
          ]
        }
      ]
    }
  ]
};

export default QCRoutes;
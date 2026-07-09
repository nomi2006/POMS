import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const PurchaseOrderList = Loadable(
  lazy(() => import('views/purchase-order/PurchaseOrderList'))
);

const AddPurchaseOrder = Loadable(
  lazy(() => import('views/purchase-order/AddPurchaseOrder'))
);

const ViewPurchaseOrder = Loadable(
  lazy(() => import('views/purchase-order/ViewPurchaseOrder'))
);

const AddClient = Loadable(
  lazy(() => import('views/client/AddClient'))
);

const ClientList = Loadable(
  lazy(() => import('views/client/ClientList'))
);

const ViewClient = Loadable(
  lazy(() => import('views/client/ViewClient'))
);

const PurchaseOrderRoutes = {
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
          path: 'purchase-order',
          children: [
            {
              path: 'list',
              element: <PurchaseOrderList />
            },
            {
              path: 'add',
              element: <AddPurchaseOrder />
            },
            {
              path: 'edit/:id',
              element: <AddPurchaseOrder />
            },
            {
              path: 'view/:id',
              element: <ViewPurchaseOrder />
            }
          ]
        },
        {
          path: 'client',
          children: [
            {
              path: 'list',
              element: <ClientList />
            },
            {
              path: 'add',
              element: <AddClient />
            },
            {
              path: 'edit/:id',
              element: <AddClient />
            },
            {
              path: 'view/:id',
              element: <ViewClient />
            }
          ]
        }
      ]
    }
  ]
};

export default PurchaseOrderRoutes;
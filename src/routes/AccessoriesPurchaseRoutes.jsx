import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

const AccessoriesPurchaseList = Loadable(
  lazy(() => import('views/Accessories-Purchase/AccessoriesPurchaseList'))
);

const AddAccessoriesPurchase = Loadable(
  lazy(() => import('views/Accessories-Purchase/AddAccessoriesPurchase'))
);

const ViewAccessoriesPurchase = Loadable(
  lazy(() => import('views/Accessories-Purchase/ViewAccessoriesPurchase'))
);

const AccessoriesPurchaseRoutes = {
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
          path: 'accessories-purchase',
          children: [
            {
              path: 'list',
              element: <AccessoriesPurchaseList />
            },
            {
              path: 'add',
              element: <AddAccessoriesPurchase />
            },
            {
              path: 'edit/:id',
              element: <AddAccessoriesPurchase />
            },
            {
              path: 'view/:id',
              element: <ViewAccessoriesPurchase />
            }
          ]
        }
      ]
    }
  ]
};

export default AccessoriesPurchaseRoutes;
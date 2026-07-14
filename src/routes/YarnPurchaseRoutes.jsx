import { lazy } from 'react';

import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';

// 🧶 YARN PURCHASE PAGES
const YarnPurchaseList = Loadable(
  lazy(() => import('views/Yarn-Purchase/YarnPurchaseList'))
);

const AddYarnPurchase = Loadable(
  lazy(() => import('views/Yarn-Purchase/AddYarnPurchase'))
);

const ViewYarnPurchase = Loadable(
  lazy(() => import('views/Yarn-Purchase/ViewYarnPurchase'))
);

const YarnPurchaseRoutes = {
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
          path: 'yarn-purchase',
          children: [
            {
              path: 'list',
              element: <YarnPurchaseList />
            },
            {
              path: 'add',
              element: <AddYarnPurchase />
            },
            {
              path: 'edit/:id',
              element: <AddYarnPurchase />
            },
            {
              path: 'view/:id',
              element: <ViewYarnPurchase />
            }
          ]
        }
      ]
    }
  ]
};

export default YarnPurchaseRoutes;
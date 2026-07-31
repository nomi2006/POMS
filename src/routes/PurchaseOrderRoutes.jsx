import { lazy } from 'react';
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

const PurchaseOrderRoutes = {
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
    }
  ]
};

export default PurchaseOrderRoutes;
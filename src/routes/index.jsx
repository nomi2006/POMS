import { createBrowserRouter } from 'react-router-dom';
import ChartMapRoutes from './ChartMapRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import FormsRoutes from './FormsRoutes';
import OtherRoutes from './OtherRoutes';
import PagesRoutes from './PagesRoutes';
import NavigationRoutes from './NavigationRoutes';
import TablesRoutes from './TablesRoutes';
import PurchaseOrderRoutes from './PurchaseOrderRoutes';
import YarnPurchaseRoutes from './YarnPurchaseRoutes';
import AccessoriesPurchaseRoutes from './AccessoriesPurchaseRoutes';
import DyingKnittingRoutes from './DyingKnittingRoutes'; 

const router = createBrowserRouter(
  [
    NavigationRoutes,
    ComponentsRoutes,
    FormsRoutes,
    TablesRoutes,
    PurchaseOrderRoutes,
    YarnPurchaseRoutes,
    AccessoriesPurchaseRoutes, 
    DyingKnittingRoutes,
    PagesRoutes,
    OtherRoutes,
    ChartMapRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
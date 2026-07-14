// project-imports
import chartsMaps from './charts-maps';
import formComponents from './forms';
import other from './other';
import pages from './pages';
import uiComponents from './ui-components';
import tableRoutes from './tables';
import navigation from './navigation';
import purchaseOrder from './purchase-order';
import procurement from './procurement'; // Import the procurement menu items

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [ navigation,purchaseOrder,procurement,uiComponents,formComponents,tableRoutes,chartsMaps,pages,other]
};

export default menuItems;

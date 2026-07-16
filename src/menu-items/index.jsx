// project-imports
import chartsMaps from './charts-maps';
import formComponents from './forms';
import other from './other';
import pages from './pages';
import uiComponents from './ui-components';
// import tableRoutes from './tables';
import navigation from './navigation';
import purchaseOrder from './purchase-order';
import procurement from './procurement';
import embroidery from './embroidery';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [ navigation,purchaseOrder,procurement,formComponents,embroidery,chartsMaps,pages,other]
};

export default menuItems;

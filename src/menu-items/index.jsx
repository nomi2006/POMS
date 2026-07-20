import chartsMaps from './charts-maps';
import formComponents from './forms';
// import other from './other';
import pages from './pages';
import uiComponents from './ui-components';
import navigation from './navigation';
import purchaseOrder from './purchase-order';
import procurement from './procurement';
import embroidery from './embroidery';
import qc from './qc';
import packing from './packing';
import settings from './settings'; 

const menuItems = {
  items: [ navigation,purchaseOrder,procurement,formComponents,embroidery,qc,packing,chartsMaps,pages,settings]
};

export default menuItems;

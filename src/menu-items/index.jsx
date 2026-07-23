import chartsMaps from './charts-maps';
// import formComponents from './forms';
// import other from './other';
import pages from './pages';
import uiComponents from './ui-components';
import navigation from './navigation';
import purchaseOrder from './purchase-order';
import knitting from './knitting';  
import dying from './dying';
import procurement from './procurement';
import embroidery from './embroidery';
import qc from './qc';
import packing from './packing';
import settings from './settings'; 

const menuItems = {
  items: [ navigation,purchaseOrder,procurement,knitting,dying,embroidery,qc,packing,chartsMaps,settings,pages]
};

export default menuItems;

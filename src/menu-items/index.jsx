import chartsMaps from './charts-maps';
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
import reports from './reports';

const roleMenuMap = {
  'Admin': [
    'navigation',
    'purchase-order',
    'procurement',
    'knitting',
    'dying',
    'embroidery',
    'qc',
    'packing',
    'settings',  
    'reports',
    'pages'
  ],
  'User': [
    'navigation',
    'settings' 
  ],
  'Purchase Order': [
    'navigation',
    'purchase-order',
    'settings',  
    'reports'
  ],
  'Yarn Purchase': [
    'navigation',
    'procurement',
    'settings',  
    'reports'
  ],
  'Accessories Purchase': [
    'navigation',
    'procurement',
    'settings',  
    'reports'
  ],
  'Knitting': [
    'navigation',
    'knitting',
    'settings',  
    'reports'
  ],
  'Dying': [
    'navigation',
    'dying',
    'settings',  
    'reports'
  ],
  'Embroidery': [
    'navigation',
    'embroidery',
    'settings',  
    'reports'
  ],
  'QC': [
    'navigation',
    'qc',
    'settings',  
    'reports'
  ],
  'Packing': [
    'navigation',
    'packing',
    'settings',  
    'reports'
  ],
  'Client': [
    'navigation',
    'settings',  
    'pages'
  ],
  'Procurement': [
    'navigation',
    'procurement',
    'settings',  
    'reports'
  ],
  'Management': [
    'navigation',
    'settings', 
    'reports'
  ],
};

const getUserRole = () => {
  return localStorage.getItem('userRole') || 'User';
};

const filterMenuItems = (items) => {
  const role = getUserRole();
  const allowedKeys = roleMenuMap[role] || ['navigation', 'settings'];
  
  console.log('🔵 User Role:', role);
  console.log('🔵 Allowed Keys:', allowedKeys);
  
  return items.filter((item) => {
    if (allowedKeys.includes(item.id)) {
      return true;
    }
    if (item.children) {
      const filteredChildren = filterMenuItems(item.children);
      if (filteredChildren.length > 0) {
        return true;
      }
    }
    return false;
  });
};

const allMenuItems = [
  navigation,
  purchaseOrder,
  procurement,
  knitting,
  dying,
  embroidery,
  qc,
  packing,
  reports,
  settings,  
  chartsMaps,
  pages
];

const menuItems = {
  items: filterMenuItems(allMenuItems)
};

export default menuItems;
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

// ✅ Role-based menu mapping
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

// ✅ Get user role from localStorage (always fresh)
const getUserRole = () => {
  const role = localStorage.getItem('userRole') || 'User';
  console.log('🔵 Current User Role:', role);
  return role;
};

// ✅ Filter menu items based on role
const filterMenuItems = (items) => {
  const role = getUserRole(); // ✅ Always fresh
  const allowedKeys = roleMenuMap[role] || ['navigation', 'settings'];
  
  console.log('🔵 Allowed Keys:', allowedKeys);
  
  return items.filter((item) => {
    if (allowedKeys.includes(item.id)) {
      console.log('✅ Allowed:', item.id);
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

// ✅ All menu items
const allMenuItems = [
  navigation,
  purchaseOrder,
  procurement,
  knitting,
  dying,
  embroidery,
  qc,
  packing,
  settings,
  reports,
  chartsMaps,
  pages
];

// ✅ Apply role-based filtering
const menuItems = {
  items: filterMenuItems(allMenuItems)
};

console.log('🔵 Final Menu Items:', menuItems.items.map(i => i.id));

export default menuItems;
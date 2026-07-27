import { auth, db } from 'config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// project-imports
import chartsMaps from './charts-maps';
import pages from './pages';
import uiComponents from './ui-components';
import navigation from './navigation';
import purchaseOrder from './purchase-order';
import procurement from './procurement';
import knitting from './knitting';
import dying from './dying';
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
    'navigation'
  ],
  'Purchase Order': [
    'navigation',
    'purchase-order',
    'reports'
  ],
  'Yarn Purchase': [
    'navigation',
    'procurement',
    'reports'
  ],
  'Accessories Purchase': [
    'navigation',
    'procurement',
    'reports'
  ],
  'Knitting': [
    'navigation',
    'knitting',
    'reports'
  ],
  'Dying': [
    'navigation',
    'dying',
    'reports'
  ],
  'Embroidery': [
    'navigation',
    'embroidery',
    'reports'
  ],
  'QC': [
    'navigation',
    'qc',
    'reports'
  ],
  'Packing': [
    'navigation',
    'packing',
    'reports'
  ],
  'Client': [
    'navigation',
    'settings'
  ],
  'Settings': [
    'navigation',
    'settings'
  ],
  'User Management': [
    'navigation',
    'pages'
  ],
  'Procurement': [
    'navigation',
    'procurement',
    'reports'
  ]
};

// ✅ Get user role from localStorage
const getUserRole = () => {
  const role = localStorage.getItem('userRole') || 'User';
  console.log('🔵 1. getUserRole() called, role:', role);  // ✅ DEBUG
  return role;
};

// ✅ Filter menu items based on role
const filterMenuItems = (items) => {
  const role = getUserRole();
  const allowedKeys = roleMenuMap[role] || ['navigation'];
  
  console.log('🔵 2. User Role:', role);
  console.log('🔵 3. Allowed Keys:', allowedKeys);
  
  const filtered = items.filter((item) => {
    if (allowedKeys.includes(item.id)) {
      console.log('✅ 4. Allowed:', item.id);
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
  
  console.log('🔵 5. Filtered Items:', filtered.map(i => i.id));
  return filtered;
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
  reports,
  settings,
  chartsMaps,
  pages
];

console.log('🔵 0. All Menu Items:', allMenuItems.map(i => i.id));

// ✅ Apply role-based filtering
const menuItems = {
  items: filterMenuItems(allMenuItems)
};

console.log('🔵 6. Final Menu Items:', menuItems.items.map(i => i.id));

export default menuItems;
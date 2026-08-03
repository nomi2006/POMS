import React from "react";
import { createBrowserRouter, Navigate } from 'react-router-dom';
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
import EmbroideryRoutes from './EmbroideryRoutes';
import QCRoutes from './QCRoutes';
import PackingRoutes from './PackingRoutes';
import Settings from 'views/settings/Settings';
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

const Login = Loadable(
  lazy(() => import('views/auth/login/Login'))
);

// ✅ Dashboard
import Dashboard from 'views/navigation/dashboard/Default';

// ✅ Purchase Order
const PurchaseOrderList = Loadable(
  lazy(() => import('views/purchase-order/PurchaseOrderList'))
);
const AddPurchaseOrder = Loadable(
  lazy(() => import('views/purchase-order/AddPurchaseOrder'))
);
const ViewPurchaseOrder = Loadable(
  lazy(() => import('views/purchase-order/ViewPurchaseOrder'))
);

// ✅ Yarn Purchase
const YarnPurchaseList = Loadable(
  lazy(() => import('views/Yarn-Purchase/YarnPurchaseList'))
);
const AddYarnPurchase = Loadable(
  lazy(() => import('views/Yarn-Purchase/AddYarnPurchase'))
);
const ViewYarnPurchase = Loadable(
  lazy(() => import('views/Yarn-Purchase/ViewYarnPurchase'))
);

// ✅ Accessories Purchase
const AccessoriesPurchaseList = Loadable(
  lazy(() => import('views/Accessories-Purchase/AccessoriesPurchaseList'))
);
const AddAccessoriesPurchase = Loadable(
  lazy(() => import('views/Accessories-Purchase/AddAccessoriesPurchase'))
);
const ViewAccessoriesPurchase = Loadable(
  lazy(() => import('views/Accessories-Purchase/ViewAccessoriesPurchase'))
);

// ✅ KNITTING
const KnittingSent = Loadable(
  lazy(() => import('views/Knitting/KnittingSent'))
);
const KnittingReceived = Loadable(
  lazy(() => import('views/Knitting/KnittingReceived'))
);
const KnittingSentList = Loadable(
  lazy(() => import('views/Knitting/KnittingSentList'))
);
const KnittingList = KnittingSentList;

// ✅ DYING
const DyingSent = Loadable(
  lazy(() => import('views/Dying/DyingSent'))
);
const DyingReceived = Loadable(
  lazy(() => import('views/Dying/DyingReceived'))
);
const DyingSentList = Loadable(
  lazy(() => import('views/Dying/DyingSentList'))
);
const DyingList = DyingSentList;

// ✅ EMBROIDERY
const EmbroiderySent = Loadable(
  lazy(() => import('views/Embroidery/EmbroiderySent'))
);
const EmbroideryReceived = Loadable(
  lazy(() => import('views/Embroidery/EmbroideryReceived'))
);

// ✅ QC
const QCSent = Loadable(
  lazy(() => import('views/QC/QCSent'))
);
const QCReceived = Loadable(
  lazy(() => import('views/QC/QCReceived'))
);

// ✅ PACKING
const PackingSent = Loadable(
  lazy(() => import('views/Packing/PackingSent'))
);
const PackingReceived = Loadable(
  lazy(() => import('views/Packing/PackingReceived'))
);
const PackingList = PackingReceived;

// ✅ User Management
const UsersList = Loadable(
  lazy(() => import('views/user-management/UsersList'))
);
const UserRole = Loadable(
  lazy(() => import('views/user-role/UserRole'))
);
const AddUserManual = Loadable(
  lazy(() => import('views/user-management/AddUserManual'))
);

// ✅ Client
const ClientList = Loadable(
  lazy(() => import('views/client/ClientList'))
);
const AddClient = Loadable(
  lazy(() => import('views/client/AddClient'))
);
// notifications
const Notifications = Loadable(
  lazy(() => import('views/notifications/Notifications'))
);

// ✅ Reports
const PurchaseOrderReport = Loadable(lazy(() => import('views/Reports/PurchaseOrderReport')));
const YarnPurchaseReport = Loadable(lazy(() => import('views/Reports/YarnPurchaseReport')));
const AccessoriesPurchaseReport = Loadable(lazy(() => import('views/Reports/AccessoriesPurchaseReport')));
const KnittingReport = Loadable(lazy(() => import('views/Reports/KnittingReport')));
const DyingReport = Loadable(lazy(() => import('views/Reports/DyingReport')));
const EmbroideryReport = Loadable(lazy(() => import('views/Reports/EmbroideryReport')));
const QCReport = Loadable(lazy(() => import('views/Reports/QCReport')));
const PackingReport = Loadable(lazy(() => import('views/Reports/PackingReport')));

const router = createBrowserRouter(
  [
    // ✅ LOGIN ROUTE
    {
      path: '/login',
      element: <Login />
    },
    // ✅ REGISTER ROUTE
    {
      path: '/register',
      element: <Login />
    },
    // ✅ UNAUTHORIZED ROUTE
    {
      path: '/unauthorized',
      element: <div className="text-center py-5"><h2>Unauthorized Access</h2></div>
    },
    // ✅ MAIN PROTECTED ROUTES
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        // ✅ Dashboard
        {
          path: '',
          element: <Navigate to="/dashboard" replace />
        },
        {
          path: 'dashboard',
          element: <Dashboard />
        },

        // ✅ PURCHASE ORDER
        {
          path: 'purchase-order',
          children: [
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <PurchaseOrderList />
                </ProtectedRoute>
              )
            },
            {
              path: 'add',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <AddPurchaseOrder />
                </ProtectedRoute>
              )
            },
            {
              path: 'edit/:id',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <AddPurchaseOrder />
                </ProtectedRoute>
              )
            },
            {
              path: 'view/:id',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <ViewPurchaseOrder />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ YARN PURCHASE
        {
          path: 'yarn-purchase',
          children: [
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Yarn Purchase">
                  <YarnPurchaseList />
                </ProtectedRoute>
              )
            },
            {
              path: 'add',
              element: (
                <ProtectedRoute requiredRole="Yarn Purchase">
                  <AddYarnPurchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'edit/:id',
              element: (
                <ProtectedRoute requiredRole="Yarn Purchase">
                  <AddYarnPurchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'view/:id',
              element: (
                <ProtectedRoute requiredRole="Yarn Purchase">
                  <ViewYarnPurchase />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ ACCESSORIES PURCHASE
        {
          path: 'accessories-purchase',
          children: [
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Accessories Purchase">
                  <AccessoriesPurchaseList />
                </ProtectedRoute>
              )
            },
            {
              path: 'add',
              element: (
                <ProtectedRoute requiredRole="Accessories Purchase">
                  <AddAccessoriesPurchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'edit/:id',
              element: (
                <ProtectedRoute requiredRole="Accessories Purchase">
                  <AddAccessoriesPurchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'view/:id',
              element: (
                <ProtectedRoute requiredRole="Accessories Purchase">
                  <ViewAccessoriesPurchase />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ KNITTING
        {
          path: 'knitting',
          children: [
            {
              path: 'sent',
              element: (
                <ProtectedRoute requiredRole="Knitting">
                  <KnittingSent />
                </ProtectedRoute>
              )
            },
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Knitting">
                  <KnittingList />
                </ProtectedRoute>
              )
            },
            {
              path: 'received',
              element: (
                <ProtectedRoute requiredRole="Knitting">
                  <KnittingReceived />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ DYING
        {
          path: 'dying',
          children: [
            {
              path: 'sent',
              element: (
                <ProtectedRoute requiredRole="Dying">
                  <DyingSent />
                </ProtectedRoute>
              )
            },
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Dying">
                  <DyingList />
                </ProtectedRoute>
              )
            },
            {
              path: 'received',
              element: (
                <ProtectedRoute requiredRole="Dying">
                  <DyingReceived />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ EMBROIDERY
        {
          path: 'embroidery',
          children: [
            {
              path: 'sent',
              element: (
                <ProtectedRoute requiredRole="Embroidery">
                  <EmbroiderySent />
                </ProtectedRoute>
              )
            },
            {
              path: 'received',
              element: (
                <ProtectedRoute requiredRole="Embroidery">
                  <EmbroideryReceived />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ QC
        {
          path: 'qc',
          children: [
            {
              path: 'sent',
              element: (
                <ProtectedRoute requiredRole="QC">
                  <QCSent />
                </ProtectedRoute>
              )
            },
            {
              path: 'received',
              element: (
                <ProtectedRoute requiredRole="QC">
                  <QCReceived />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ PACKING
        {
          path: 'packing',
          children: [
            {
              path: 'sent',
              element: (
                <ProtectedRoute requiredRole="Packing">
                  <PackingSent />
                </ProtectedRoute>
              )
            },
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole="Packing">
                  <PackingList />
                </ProtectedRoute>
              )
            },
            {
              path: 'received',
              element: (
                <ProtectedRoute requiredRole="Packing">
                  <PackingReceived />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ CLIENT
        {
          path: 'client',
          children: [
            {
              path: 'list',
              element: (
                <ProtectedRoute requiredRole={['Admin', 'Client']}>
                  <ClientList />
                </ProtectedRoute>
              )
            },
            {
              path: 'add',
              element: (
                <ProtectedRoute requiredRole={['Admin', 'Client']}>
                  <AddClient />
                </ProtectedRoute>
              )
            },
            {
              path: 'edit/:id',
              element: (
                <ProtectedRoute requiredRole={['Admin', 'Client']}>
                  <AddClient />
                </ProtectedRoute>
              )
            }
          ]
        },

        // ✅ USER MANAGEMENT - Admin only
        {
          path: 'user-role',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UserRole />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-role/edit/:id',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UserRole />
            </ProtectedRoute>
          )
        },
        {
          path: 'add-user-manual',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <AddUserManual />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-management/list',
          element: (
            <ProtectedRoute requiredRole="Admin">
              <UsersList />
            </ProtectedRoute>
          )
        },

        // ✅ REPORTS
        {
          path: 'reports',
          children: [
            {
              path: 'purchase-order',
              element: (
                <ProtectedRoute requiredRole="Purchase Order">
                  <PurchaseOrderReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'yarn-purchase',
              element: (
                <ProtectedRoute requiredRole={['Yarn Purchase', 'Procurement']}>
                  <YarnPurchaseReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'accessories-purchase',
              element: (
                <ProtectedRoute requiredRole={['Accessories Purchase', 'Procurement']}>
                  <AccessoriesPurchaseReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'knitting',
              element: (
                <ProtectedRoute requiredRole="Knitting">
                  <KnittingReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'dying',
              element: (
                <ProtectedRoute requiredRole="Dying">
                  <DyingReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'embroidery',
              element: (
                <ProtectedRoute requiredRole="Embroidery">
                  <EmbroideryReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'qc',
              element: (
                <ProtectedRoute requiredRole="QC">
                  <QCReport />
                </ProtectedRoute>
              )
            },
            {
              path: 'packing',
              element: (
                <ProtectedRoute requiredRole="Packing">
                  <PackingReport />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          )
        },
        {
          path: 'notifications',
          element: (
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          )
        }
      ]
    },
    // ✅ OTHER ROUTES
    NavigationRoutes,
    ComponentsRoutes,
    FormsRoutes,
    TablesRoutes,
    PagesRoutes,
    OtherRoutes,
    ChartMapRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
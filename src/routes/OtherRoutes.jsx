import { lazy } from 'react';
import ProtectedRoute from "components/ProtectedRoute";

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - other pages
const OtherSamplePage = Loadable(lazy(() => import('views/SamplePage')));

// ==============================|| OTHER ROUTING ||============================== //

const OtherRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ), children: [
        {
          path: 'other',
          children: [
            {
              path: 'sample-page',
              element: <OtherSamplePage />
            }
          ]
        }
      ]
    }
  ]
};

export default OtherRoutes;

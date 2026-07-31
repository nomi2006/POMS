import { lazy } from 'react';
import Loadable from 'components/Loadable';

const Settings = Loadable(
  lazy(() => import('views/settings/Settings'))
);

const SettingsRoutes = {
  children: [
    {
      path: 'settings',
      element: <Settings />
    }
  ]
};

export default SettingsRoutes;
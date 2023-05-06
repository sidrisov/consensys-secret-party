import { createBrowserRouter, Navigate } from 'react-router-dom';
import Page404 from './pages/Page404';
import Guest from './pages/Guest';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

import AppWithProviders from './layouts/AppWithProviders';

export const appRoutes = ['/guest', '/admin', '/settings'];
export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppWithProviders />,
    errorElement: <Page404 />,
    children: [
      { element: <Navigate to="/guest" />, index: true },
      { path: 'guest', element: <Guest /> },
      { path: 'admin', element: <Admin /> },
      { path: 'settings', element: <Settings /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

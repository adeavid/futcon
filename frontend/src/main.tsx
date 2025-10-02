import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Route as RootRoute } from './routes/__root';
import { Route as GlobalRankingRoute } from './routes/global-ranking';
import { Route as TechnologyRankingRoute } from './routes/technology-ranking';
import { Route as VendorDetailRoute } from './routes/vendor-detail';
import './index.css';

const queryClient = new QueryClient();

const routeTree = RootRoute.addChildren([GlobalRankingRoute, TechnologyRankingRoute, VendorDetailRoute]);

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV ? <TanStackRouterDevtools router={router} position="bottom-right" /> : null}
    </QueryClientProvider>
  </React.StrictMode>,
);

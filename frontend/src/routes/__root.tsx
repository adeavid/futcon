import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import React from 'react';

export interface RouterContext {
  queryClient: QueryClient;
}

const RouteComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">Telco Performance</h1>
          <nav aria-label="Navegación principal">
            <ul className="flex gap-4 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="text-slate-700 transition-colors hover:text-slate-900"
                  activeProps={{ className: 'text-blue-600' }}
                >
                  Clasificación global
                </Link>
              </li>
              <li>
                <Link
                  to="/ranking-tecnologia"
                  className="cursor-not-allowed text-slate-400"
                >
                  Ranking por tecnología
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

const ErrorComponent: React.FC<{ error: unknown }> = ({ error }) => {
  const message = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.';

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4" role="alert" aria-live="assertive">
      <h2 className="text-lg font-semibold text-red-800">Error al cargar la aplicación</h2>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

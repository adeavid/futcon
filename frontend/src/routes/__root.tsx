import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import React from 'react';

export interface RouterContext {
  queryClient: QueryClient;
}

const themeStorageKey = 'fc-theme-preference';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const detectSystemPreference = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const stored = window.localStorage.getItem(themeStorageKey) as Theme | null;
    return stored ?? detectSystemPreference();
  });

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    const next = theme === 'dark' ? 'theme-dark' : 'theme-light';
    root.classList.add(next);
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500"
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Modo oscuro' : 'Modo claro'}</span>
    </button>
  );
};

const ThemeStatus: React.FC = () => {
  const { theme } = useTheme();
  return <span>Construido con React, TanStack y FastAPI. Modo {theme === 'dark' ? 'oscuro' : 'claro'} activo.</span>;
};

const RouteComponent: React.FC = () => {
  return (
    <ThemeProvider>
      <a href="#contenido" className="skip-link">
        Saltar al contenido principal
      </a>
      <div className="min-h-screen bg-[rgb(var(--bg-subtle))] text-[rgb(var(--text-primary))] transition-colors">
        <header className="border-b border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-sky-500/10 p-2">
                <span className="text-lg font-semibold text-sky-600 dark:text-sky-400">FC</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[rgb(var(--text-secondary))]">Telco Performance</p>
                <h1 className="text-xl font-semibold">Dashboard de vendors</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav aria-label="Navegación principal">
                <ul className="flex gap-3 text-sm font-medium">
                  <li>
                    <Link
                      to="/"
                      className="focus-ring rounded-full px-3 py-1 text-[rgb(var(--text-secondary))] transition hover:text-[rgb(var(--text-primary))]"
                      activeProps={{
                        className: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
                        'aria-current': 'page',
                      }}
                    >
                      Clasificación global
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ranking-tecnologia"
                      className="focus-ring rounded-full px-3 py-1 text-[rgb(var(--text-secondary))] transition hover:text-[rgb(var(--text-primary))]"
                      activeProps={{
                        className: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
                        'aria-current': 'page',
                      }}
                    >
                      Ranking por tecnología
                    </Link>
                  </li>
                </ul>
              </nav>
              <ThemeToggleButton />
            </div>
          </div>
        </header>
        <main id="contenido" className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <Outlet />
          </section>
          <aside className="hidden flex-col gap-4 rounded-xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-4 shadow-sm lg:flex">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--text-secondary))]">
              Sugerencias de análisis
            </h2>
            <ul className="space-y-3 text-sm text-[rgb(var(--text-secondary))]">
              <li>
                Revisa los vendors con mayor variabilidad de velocidad para detectar oportunidades de mejora.
              </li>
              <li>
                Compara tecnologías emergentes (5G) frente a legadas (2G) para priorizar inversiones.
              </li>
              <li>
                Consulta el detalle por vendor para validar antenas de bajo rendimiento y planificar optimizaciones.
              </li>
            </ul>
          </aside>
        </main>
        <footer className="border-t border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))]">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-[rgb(var(--text-secondary))] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Future Connections. Todos los derechos reservados.</p>
            <p className="text-[rgb(var(--text-secondary))]">
              <ThemeStatus />
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

const ErrorComponent: React.FC<{ error: unknown }> = ({ error }) => {
  const message = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.';

  return (
    <div className="focus-ring rounded-md border border-red-200 bg-red-50 p-4" role="alert" aria-live="assertive">
      <h2 className="text-lg font-semibold text-red-800">Error al cargar la aplicación</h2>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

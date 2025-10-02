import React from 'react';
import { Link, createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import { useVendorsQuery } from '../api/vendors';
import { TechnologyRankingControls } from '../components/TechnologyRankingControls';
import { VendorTable } from '../components/VendorTable';
import { computeTechnologyRanking, listTechnologies } from '../lib/vendor';

export const TechnologyRankingPage: React.FC = () => {
  const { data, isLoading, isError, refetch, error } = useVendorsQuery();
  const vendors = data ?? [];

  const technologies = React.useMemo(() => listTechnologies(vendors), [vendors]);

  const [selectedTechnology, setSelectedTechnology] = React.useState<string>(() => technologies[0] ?? '');

  React.useEffect(() => {
    if (technologies.length === 0) {
      setSelectedTechnology('');
      return;
    }

    if (!technologies.includes(selectedTechnology)) {
      setSelectedTechnology(technologies[0]);
    }
  }, [technologies, selectedTechnology]);

  const rankingRows = React.useMemo(() => {
    if (!selectedTechnology) {
      return [];
    }

    return computeTechnologyRanking(vendors, selectedTechnology);
  }, [selectedTechnology, vendors]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-2 rounded-md border border-slate-200 bg-white p-6 text-center"
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-slate-600">Cargando ranking por tecnología…</p>
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar la información de los vendors.';

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-start gap-3 rounded-md border border-red-200 bg-red-50 p-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-red-800">Error al obtener los vendors</h2>
          <p className="text-sm text-red-700">{message}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring focus-visible:ring-red-300"
          onClick={() => refetch()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (technologies.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 text-center" role="status" aria-live="polite">
        <p className="text-sm text-slate-600">No hay tecnologías disponibles para mostrar el ranking.</p>
      </div>
    );
  }

  const hasData = rankingRows.length > 0;

  return (
    <div className="space-y-6">
      <TechnologyRankingControls
        technologies={technologies}
        selected={selectedTechnology}
        onChange={setSelectedTechnology}
      />
      {hasData ? (
        <VendorTable
          rows={rankingRows}
          caption={`Ranking por tecnología (${selectedTechnology})`}
          renderVendorName={(vendorId, vendorName) => (
            <Link
              to="/vendor/$vendorId"
              params={{ vendorId }}
              className="focus-ring rounded-full px-2 py-1 text-sky-600 underline-offset-2 transition hover:bg-sky-500/10 dark:text-sky-300"
              aria-label={`Ver detalle de ${vendorName}`}
            >
              {vendorName}
            </Link>
          )}
        />
      ) : (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-center" role="status" aria-live="polite">
          <p className="text-sm text-slate-600">No hay datos para esta tecnología.</p>
        </div>
      )}
    </div>
  );
};

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/ranking-tecnologia',
  component: TechnologyRankingPage,
});

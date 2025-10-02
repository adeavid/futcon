import React from 'react';
import { Link, createRoute } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import { useVendorsQuery, selectVendorById } from '../api/vendors';
import { VendorCard } from '../components/VendorCard';
import { AntennaList } from '../components/AntennaList';
import { summarizeVendorSpeeds } from '../lib/vendor';
import { VendorInsightCard } from '../components/VendorInsightCard';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/vendor/$vendorId',
  component: VendorDetailPage,
});

function VendorDetailPage() {
  const { vendorId } = Route.useParams();
  const { data, isLoading, isError, refetch, error } = useVendorsQuery();
  const vendors = data ?? [];

  const vendor = React.useMemo(() => selectVendorById(vendors, vendorId), [vendors, vendorId]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-2 rounded-md border border-slate-200 bg-white p-6 text-center"
      >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-sm text-slate-600">Cargando información del vendor…</p>
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar la información del vendor.';

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-start gap-3 rounded-md border border-red-200 bg-red-50 p-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-red-800">Error al obtener el vendor</h2>
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

  if (!vendor) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-6" role="alert" aria-live="assertive">
          <h2 className="text-lg font-semibold text-yellow-800">Vendor no encontrado</h2>
          <p className="text-sm text-yellow-700">Es posible que el vendor haya sido eliminado o el enlace no sea correcto.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring focus-visible:ring-slate-300"
        >
          Volver al ranking global
        </Link>
      </div>
    );
  }

  const summary = summarizeVendorSpeeds(vendor.antennas);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="focus-ring inline-flex w-fit items-center gap-2 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] px-3 py-2 text-sm font-medium text-[rgb(var(--text-secondary))] transition hover:border-sky-300 hover:text-sky-600"
      >
        ← Volver al ranking global
      </Link>
      <VendorCard vendor={vendor} summary={summary} />
      <VendorInsightCard antennas={vendor.antennas} />
      <AntennaList antennas={vendor.antennas} />
    </div>
  );
}

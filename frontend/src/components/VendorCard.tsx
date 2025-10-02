import React from 'react';
import type { Vendor } from '../api/vendors';
import { formatFoundationDate, formatSpeed, summarizeVendorSpeeds } from '../lib/vendor';

interface VendorCardProps {
  vendor: Vendor;
  summary: ReturnType<typeof summarizeVendorSpeeds>;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, summary }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" aria-label={`Detalle del vendor ${vendor.vendor}`}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={vendor.picture}
            alt={`Logo de ${vendor.vendor}`}
            className="h-16 w-16 rounded-full border border-slate-200 object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{vendor.vendor}</h1>
            <p className="text-sm text-slate-600">Fundado el {formatFoundationDate(vendor.foundationDate)}</p>
          </div>
        </div>
      </header>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resumen de velocidades</h2>
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-xs uppercase text-slate-500">Velocidad media</dt>
            <dd className="text-lg font-semibold text-slate-800">{formatSpeed(summary.average)}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-xs uppercase text-slate-500">Velocidad mínima</dt>
            <dd className="text-lg font-semibold text-slate-800">{formatSpeed(summary.min)}</dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-xs uppercase text-slate-500">Velocidad máxima</dt>
            <dd className="text-lg font-semibold text-slate-800">{formatSpeed(summary.max)}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
};

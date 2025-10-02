import React from 'react';
import type { Vendor } from '../api/vendors';
import { formatFoundationDate, formatSpeed, summarizeVendorSpeeds } from '../lib/vendor';
import { Icon } from './icons';

interface VendorCardProps {
  vendor: Vendor;
  summary: ReturnType<typeof summarizeVendorSpeeds>;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, summary }) => {
  return (
    <article
      className="rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-5 shadow-sm transition-colors sm:p-6"
      aria-label={`Detalle del vendor ${vendor.vendor}`}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src={vendor.picture}
            alt={`Logo de ${vendor.vendor}`}
            className="h-16 w-16 rounded-full border border-[rgb(var(--border-muted))] object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold text-[rgb(var(--text-primary))]">{vendor.vendor}</h1>
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Fundado el {formatFoundationDate(vendor.foundationDate)}
            </p>
          </div>
        </div>
      </header>
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[rgb(var(--text-secondary))]">
          <Icon name="spark" className="h-4 w-4" /> Resumen de velocidades
        </h2>
        <dl className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-subtle))] p-4 transition hover:shadow-md">
            <dt className="text-xs uppercase text-[rgb(var(--text-secondary))]">Velocidad media</dt>
            <dd className="text-lg font-semibold text-[rgb(var(--text-primary))]">{formatSpeed(summary.average)}</dd>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-subtle))] p-4 transition hover:shadow-md">
            <dt className="text-xs uppercase text-[rgb(var(--text-secondary))]">Velocidad mínima</dt>
            <dd className="text-lg font-semibold text-[rgb(var(--text-primary))]">{formatSpeed(summary.min)}</dd>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-subtle))] p-4 transition hover:shadow-md">
            <dt className="text-xs uppercase text-[rgb(var(--text-secondary))]">Velocidad máxima</dt>
            <dd className="text-lg font-semibold text-[rgb(var(--text-primary))]">{formatSpeed(summary.max)}</dd>
          </div>
        </dl>
      </section>
    </article>
  );
};

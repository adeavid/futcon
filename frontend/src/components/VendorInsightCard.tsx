import React from 'react';
import type { Antenna } from '../api/vendors';
import { computeVendorTechnologyAverages } from '../lib/vendor';
import { Icon } from './icons';

interface VendorInsightCardProps {
  antennas: Antenna[];
}

export const VendorInsightCard: React.FC<VendorInsightCardProps> = ({ antennas }) => {
  const points = React.useMemo(() => computeVendorTechnologyAverages(antennas), [antennas]);

  if (points.length === 0) {
    return null;
  }

  const maxSpeed = Math.max(...points.map((point) => point.averageSpeed)) || 1;

  return (
    <section className="rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-5 shadow-sm transition hover:shadow-lg sm:p-6">
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-sky-500/10 p-2">
          <Icon name="trendUp" className="h-5 w-5 text-sky-600 dark:text-sky-300" />
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[rgb(var(--text-secondary))]">
            Rendimiento por tecnología
          </h2>
          <p className="text-xs text-[rgb(var(--text-secondary))]">
            Velocidad media normalizada vs. tecnologías activas
          </p>
        </div>
      </header>
      <div className="mt-5 space-y-3">
        {points.map((point) => {
          const percentage = Math.round((point.averageSpeed / maxSpeed) * 100);
          return (
            <div key={point.technology} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-[rgb(var(--text-secondary))]">
                <span className="flex items-center gap-2 font-medium">
                  <Icon name="antenna" className="h-3 w-3" />
                  {point.technology}
                </span>
                <span>{point.averageSpeed.toFixed(1)} Mbps</span>
              </div>
              <div className="h-2 rounded-full bg-sky-500/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"
                  style={{ width: `${percentage}%`, transition: 'width 300ms ease' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import type { Antenna } from '../api/vendors';
import { computeVendorTechnologyAverages } from '../lib/vendor';

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
    <section className="rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-6 shadow-sm transition-colors">
      <header className="flex items-center justify-between">
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
                <span className="font-medium">{point.technology}</span>
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

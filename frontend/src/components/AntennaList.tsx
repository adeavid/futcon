import React from 'react';
import type { Antenna } from '../api/vendors';
import { formatSpeed, normalizeTechnology, parseSpeed } from '../lib/vendor';

interface AntennaListProps {
  antennas: Antenna[];
}

export const AntennaList: React.FC<AntennaListProps> = ({ antennas }) => {
  const sortedAntennas = React.useMemo(() => {
    return [...antennas].sort((a, b) => {
      const techComparison = normalizeTechnology(a.technology).localeCompare(normalizeTechnology(b.technology));

      if (techComparison !== 0) {
        return techComparison;
      }

      return parseSpeed(b.speedMbps) - parseSpeed(a.speedMbps);
    });
  }, [antennas]);

  if (sortedAntennas.length === 0) {
    return (
      <div
        className="rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-6 text-center text-sm text-[rgb(var(--text-secondary))]"
        role="status"
        aria-live="polite"
      >
        <p>Este vendor no tiene antenas registradas.</p>
      </div>
    );
  }

  return (
    <section aria-label="Listado de antenas">
      <table className="mt-6 min-w-full table-auto overflow-hidden rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] text-left shadow-sm">
        <caption className="px-4 py-3 text-left text-sm text-[rgb(var(--text-secondary))]">Antenas disponibles</caption>
        <thead className="bg-[rgb(var(--bg-subtle))] text-xs uppercase tracking-wide text-[rgb(var(--text-secondary))]">
          <tr>
            <th scope="col" className="px-4 py-3">Tecnología</th>
            <th scope="col" className="px-4 py-3">Velocidad</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[rgb(var(--text-primary))]">
          {sortedAntennas.map((antenna, index) => (
            <tr
              key={`${antenna.technology}-${antenna.speedMbps}-${index}`}
              className={index % 2 === 0 ? 'bg-[rgb(var(--bg-surface))]' : 'bg-[rgb(var(--bg-subtle))]'}
            >
              <td className="px-4 py-3 font-medium">{normalizeTechnology(antenna.technology)}</td>
              <td className="px-4 py-3">{formatSpeed(parseSpeed(antenna.speedMbps))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

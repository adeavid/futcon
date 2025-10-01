import React from 'react';
import type { Vendor } from '../api/vendors';
import { computeAverage, formatSpeed } from '../lib/vendor';

interface VendorTableProps {
  vendors: Vendor[];
}

export const VendorTable: React.FC<VendorTableProps> = ({ vendors }) => {
  const ranking = React.useMemo(() => {
    return vendors
      .map((vendor) => ({
        vendor,
        averageSpeed: computeAverage(vendor.antennas),
      }))
      .sort((a, b) => b.averageSpeed - a.averageSpeed);
  }, [vendors]);

  return (
    <section aria-live="polite" className="overflow-x-auto">
      <table className="min-w-full table-auto overflow-hidden rounded-lg border border-slate-200 bg-white text-left">
        <caption className="px-4 py-3 text-left text-sm text-slate-600">
          Clasificación global por velocidad media
        </caption>
        <thead className="bg-slate-100 text-sm uppercase text-slate-700">
          <tr>
            <th scope="col" className="px-4 py-3">Posición</th>
            <th scope="col" className="px-4 py-3">Vendor</th>
            <th scope="col" className="px-4 py-3">Velocidad media</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-800">
          {ranking.map(({ vendor, averageSpeed }, index) => (
            <tr key={vendor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-3 font-semibold">{index + 1}</td>
              <td className="px-4 py-3">{vendor.vendor}</td>
              <td className="px-4 py-3">{formatSpeed(averageSpeed)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

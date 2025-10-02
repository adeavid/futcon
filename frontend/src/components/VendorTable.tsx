import React from 'react';
import type { Vendor } from '../api/vendors';
import { computeAverage, formatSpeed, type TechnologyRankingRow } from '../lib/vendor';

interface VendorTableProps {
  vendors?: Vendor[];
  rows?: TechnologyRankingRow[];
  caption?: string;
  renderVendorName?: (vendorId: string, vendorName: string) => React.ReactNode;
}

export const VendorTable: React.FC<VendorTableProps> = ({ vendors = [], rows, caption, renderVendorName }) => {
  type RankingEntry =
    | { vendor: Vendor; averageSpeed: number }
    | { vendorId: string; vendorName: string; averageSpeed: number };

  const ranking = React.useMemo(() => {
    if (rows) {
      return rows.map<RankingEntry>((row) => ({
        vendorId: row.vendorId,
        vendorName: row.vendorName,
        averageSpeed: row.averageSpeed,
      }));
    }

    return vendors
      .map<RankingEntry>((vendor) => ({
        vendor,
        averageSpeed: computeAverage(vendor.antennas),
      }))
      .sort((a, b) => b.averageSpeed - a.averageSpeed);
  }, [rows, vendors]);

  return (
    <section aria-live="polite" className="overflow-x-auto">
      <table className="min-w-full table-auto overflow-hidden rounded-lg border border-slate-200 bg-white text-left">
        <caption className="px-4 py-3 text-left text-sm text-slate-600">
          {caption ?? 'Clasificación global por velocidad media'}
        </caption>
        <thead className="bg-slate-100 text-sm uppercase text-slate-700">
          <tr>
            <th scope="col" className="px-4 py-3">Posición</th>
            <th scope="col" className="px-4 py-3">Vendor</th>
            <th scope="col" className="px-4 py-3">Velocidad media</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-800">
          {ranking.map((entry, index) => {
            const vendorId = 'vendor' in entry ? entry.vendor.id : entry.vendorId;
            const vendorName = 'vendor' in entry ? entry.vendor.vendor : entry.vendorName;
            const averageSpeed = entry.averageSpeed;
            const content = renderVendorName ? renderVendorName(vendorId, vendorName) : vendorName;

            return (
              <tr key={vendorId} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-semibold">{index + 1}</td>
                <td className="px-4 py-3">{content}</td>
                <td className="px-4 py-3">{formatSpeed(averageSpeed)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

import { describe, expect, it } from 'vitest';
import type { Vendor } from '../api/vendors';
import {
  computeAverage,
  computeTechnologyRanking,
  formatFoundationDate,
  listTechnologies,
  normalizeTechnology,
  parseSpeed,
  summarizeVendorSpeeds,
} from '../lib/vendor';

describe('vendor utils', () => {
  const vendors: Vendor[] = [
    {
      id: '1',
      vendor: 'Vendor A',
      picture: '',
      foundationDate: 0,
      antennas: [
        { technology: '2g', speedMbps: '100 Mbps' },
        { technology: '5G', speedMbps: '500 Mbps' },
      ],
    },
    {
      id: '2',
      vendor: 'Vendor B',
      picture: '',
      foundationDate: 0,
      antennas: [
        { technology: '2G', speedMbps: '200 Mbps' },
      ],
    },
    {
      id: '3',
      vendor: 'Vendor C',
      picture: '',
      foundationDate: 0,
      antennas: [],
    },
  ];

  it('parseSpeed convierte string en number y valida formato', () => {
    expect(parseSpeed('120 Mbps')).toBe(120);
    expect(parseSpeed(' 75.5 Mbps ')).toBeCloseTo(75.5);
    expect(() => parseSpeed('invalid')).toThrow(/Formato de velocidad inválido/);
  });

  it('computeAverage calcula la media incluso con strings mixtos', () => {
    const average = computeAverage([
      { technology: 'test', speedMbps: '10 Mbps' },
      { technology: 'test', speedMbps: '20 Mbps' },
    ]);

    expect(average).toBe(15);
  });

  it('listTechnologies retorna tecnologías únicas y ordenadas', () => {
    const technologies = listTechnologies(vendors);
    expect(technologies).toEqual(['2G', '5G']);
  });

  it('computeTechnologyRanking filtra por tecnología y ordena por velocidad', () => {
    const ranking = computeTechnologyRanking(vendors, '2g');

    expect(ranking).toHaveLength(2);
    expect(ranking[0]).toMatchObject({ vendorName: 'Vendor B' });
    expect(ranking[1]).toMatchObject({ vendorName: 'Vendor A' });
  });

  it('computeTechnologyRanking ignora vendors sin datos de la tecnología', () => {
    const ranking = computeTechnologyRanking(vendors, '5G');

    expect(ranking).toHaveLength(1);
    expect(ranking[0].vendorName).toBe('Vendor A');
  });

  it('computeTechnologyRanking falla con tecnología vacía', () => {
    expect(() => computeTechnologyRanking(vendors, '   ')).toThrow('La tecnología seleccionada es obligatoria.');
  });

  it('normalizeTechnology convierte a uppercase y recorta espacios', () => {
    expect(normalizeTechnology(' lTe ')).toBe('LTE');
  });

  it('formatFoundationDate convierte epoch en fecha legible', () => {
    // 1 enero 2000
    expect(formatFoundationDate(946684800000)).toMatch(/2000/);
  });

  it('summarizeVendorSpeeds calcula media, min y max', () => {
    const summary = summarizeVendorSpeeds([
      { technology: '3G', speedMbps: '100 Mbps' },
      { technology: '4G', speedMbps: '300 Mbps' },
    ]);

    expect(summary.average).toBeCloseTo(200);
    expect(summary.min).toBe(100);
    expect(summary.max).toBe(300);
  });

  it('summarizeVendorSpeeds devuelve ceros cuando no hay antenas', () => {
    expect(summarizeVendorSpeeds([])).toEqual({ average: 0, min: 0, max: 0 });
  });
});

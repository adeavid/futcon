import type { Antenna, Vendor } from '../api/vendors';

const SPEED_REGEX = /^(-?\d+(?:\.\d+)?)\s*Mbps$/i;

export interface TechnologyRankingRow {
  vendorId: string;
  vendorName: string;
  averageSpeed: number;
}

export interface VendorSpeedSummary {
  average: number;
  min: number;
  max: number;
}

export const parseSpeed = (speed: string): number => {
  const trimmed = speed.trim();
  const match = SPEED_REGEX.exec(trimmed);

  if (!match) {
    throw new Error(`Formato de velocidad inválido: ${speed}`);
  }

  return Number(match[1]);
};

export const formatSpeed = (value: number): string => {
  return `${value.toFixed(2)} Mbps`;
};

export const computeAverage = (antennas: Antenna[]): number => {
  if (antennas.length === 0) {
    return 0;
  }

  const total = antennas.reduce((accumulator, antenna) => {
    return accumulator + parseSpeed(antenna.speedMbps);
  }, 0);

  return total / antennas.length;
};

export const listTechnologies = (vendors: Vendor[]): string[] => {
  const technologies = new Set<string>();

  vendors.forEach((vendor) => {
    vendor.antennas.forEach((antenna) => {
      if (antenna.technology) {
        technologies.add(normalizeTechnology(antenna.technology));
      }
    });
  });

  return Array.from(technologies).sort((a, b) => a.localeCompare(b));
};

export const computeTechnologyRanking = (vendors: Vendor[], technology: string): TechnologyRankingRow[] => {
  const normalizedTechnology = normalizeTechnology(technology);

  if (!normalizedTechnology) {
    throw new Error('La tecnología seleccionada es obligatoria.');
  }

  const rows = vendors
    .map<TechnologyRankingRow | null>((vendor) => {
      const antennas = vendor.antennas.filter(
        (antenna) => normalizeTechnology(antenna.technology) === normalizedTechnology,
      );

      if (antennas.length === 0) {
        return null;
      }

      return {
        vendorId: vendor.id,
        vendorName: vendor.vendor,
        averageSpeed: computeAverage(antennas),
      };
    })
    .filter((row): row is TechnologyRankingRow => row !== null)
    .sort((a, b) => b.averageSpeed - a.averageSpeed);

  return rows;
};

export const normalizeTechnology = (value: string): string => {
  return value.trim().toUpperCase();
};

export const formatFoundationDate = (epochMs: number): string => {
  const date = new Date(epochMs);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const summarizeVendorSpeeds = (antennas: Antenna[]): VendorSpeedSummary => {
  if (antennas.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }

  const speeds = antennas.map((antenna) => parseSpeed(antenna.speedMbps));
  const total = speeds.reduce((sum, speed) => sum + speed, 0);

  return {
    average: total / speeds.length,
    min: Math.min(...speeds),
    max: Math.max(...speeds),
  };
};

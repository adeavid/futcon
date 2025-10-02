import type { Antenna, Vendor } from '../api/vendors';

const SPEED_REGEX = /^(-?\d+(?:\.\d+)?)\s*Mbps$/i;

export interface TechnologyRankingRow {
  vendorId: string;
  vendorName: string;
  averageSpeed: number;
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
        technologies.add(antenna.technology.toUpperCase());
      }
    });
  });

  return Array.from(technologies).sort((a, b) => a.localeCompare(b));
};

export const computeTechnologyRanking = (vendors: Vendor[], technology: string): TechnologyRankingRow[] => {
  const normalizedTechnology = technology.trim().toUpperCase();

  if (!normalizedTechnology) {
    throw new Error('La tecnología seleccionada es obligatoria.');
  }

  const rows = vendors
    .map<TechnologyRankingRow | null>((vendor) => {
      const antennas = vendor.antennas.filter((antenna) => antenna.technology.toUpperCase() === normalizedTechnology);

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

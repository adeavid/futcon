import type { Antenna } from '../api/vendors';

const SPEED_REGEX = /^(-?\d+(?:\.\d+)?)\s*Mbps$/i;

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

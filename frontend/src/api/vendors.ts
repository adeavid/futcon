import { useQuery } from '@tanstack/react-query';

export interface Antenna {
  technology: string;
  speedMbps: string;
}

export interface Vendor {
  id: string;
  picture: string;
  foundationDate: number;
  vendor: string;
  antennas: Antenna[];
}

export const fetchVendors = async (): Promise<Vendor[]> => {
  const response = await fetch('/api/vendors');

  if (!response.ok) {
    throw new Error('No se pudieron obtener los vendors');
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Formato de vendors inválido');
  }

  return data as Vendor[];
};

export const useVendorsQuery = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 300,
  });
};

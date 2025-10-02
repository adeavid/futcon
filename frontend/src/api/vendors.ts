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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const vendorsEndpoint = API_BASE_URL ? `${API_BASE_URL}/api/vendors` : '/api/vendors';

export const fetchVendors = async (): Promise<Vendor[]> => {
  const response = await fetch(vendorsEndpoint);

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

export const selectVendorById = (vendors: Vendor[], vendorId: string): Vendor | undefined => {
  return vendors.find((vendor) => vendor.id === vendorId);
};

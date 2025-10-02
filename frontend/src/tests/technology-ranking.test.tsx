import '@testing-library/jest-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnologyRankingPage } from '../routes/technology-ranking';
import type { Vendor } from '../api/vendors';
import * as vendorLib from '../lib/vendor';

describe('TechnologyRankingPage', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  const mockVendors: Vendor[] = [
    {
      id: '1',
      vendor: 'Vendor A',
      picture: '',
      foundationDate: 0,
      antennas: [
        { technology: '2G', speedMbps: '100 Mbps' },
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
        { technology: '4G', speedMbps: '300 Mbps' },
      ],
    },
  ];

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('muestra el estado de carga', () => {
    const pendingPromise = new Promise<Response>(() => {});
    vi.spyOn(global, 'fetch').mockImplementation(() => pendingPromise as unknown as Promise<Response>);

    const Wrapper = createWrapper();

    const { unmount } = render(<TechnologyRankingPage />, { wrapper: Wrapper });

    expect(screen.getByRole('status')).toBeInTheDocument();

    unmount();
  });

  it('renderiza ranking por tecnología y permite cambiar de opción', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockVendors), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const Wrapper = createWrapper();

    render(<TechnologyRankingPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    const caption = screen.getByText(/Ranking por tecnología/i);
    expect(caption.tagName.toLowerCase()).toBe('caption');

    const select = screen.getByRole('combobox', { name: /selecciona tecnología/i });
    expect(select).toHaveValue('2G');

    await userEvent.selectOptions(select, '5G');
    expect(select).toHaveValue('5G');
    const rows = screen.getAllByRole('row');
    const [, firstRow] = rows;
    expect(firstRow).toHaveTextContent('Vendor A');
  });

  it('muestra estado de error y reintenta', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Fallo backend'));

    const Wrapper = createWrapper();

    render(<TechnologyRankingPage />, { wrapper: Wrapper });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Fallo backend');
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay datos para la tecnología seleccionada', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockVendors), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const listTechnologiesSpy = vi.spyOn(vendorLib, 'listTechnologies');
    listTechnologiesSpy.mockReturnValue(['2G', 'WIFI']);
    const originalCompute = vendorLib.computeTechnologyRanking;
    vi.spyOn(vendorLib, 'computeTechnologyRanking').mockImplementation((vendors, tech) => {
      if (tech === 'WIFI') {
        return [];
      }

      return originalCompute(vendors, tech);
    });

    const Wrapper = createWrapper();

    render(<TechnologyRankingPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    const select = screen.getByRole('combobox', { name: /selecciona tecnología/i });
    await userEvent.selectOptions(select, 'WIFI');

    expect(screen.getByText('No hay datos para esta tecnología.')).toBeInTheDocument();
  });
});

import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router');
  return {
    ...actual,
    Link: ({ to, params = {}, children, ...props }: any) => {
      let href = typeof to === 'string' ? to : String(to);
      if (typeof to === 'string') {
        Object.entries(params as Record<string, string>).forEach(([key, value]) => {
          href = href.replace(`$${key}`, value);
        });
      }
      const { activeProps: _activeProps, ...rest } = props;
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    },
  };
});

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { GlobalRankingPage } from '../routes/global-ranking';
import type { Vendor } from '../api/vendors';

describe('GlobalRankingPage', () => {
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

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('muestra el estado de carga', () => {
    const pendingPromise = new Promise<Response>(() => {
      // intentionally never resolve to assert loading state
    });

    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => pendingPromise as unknown as Promise<Response>,
    );

    const Wrapper = createWrapper();

    const { unmount } = render(<GlobalRankingPage />, { wrapper: Wrapper });

    expect(screen.getByRole('status')).toBeInTheDocument();

    unmount();
  });

  it('muestra el estado de error y permite reintentar', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Fallo de red'));

    const Wrapper = createWrapper();

    render(<GlobalRankingPage />, { wrapper: Wrapper });

    const alert = await screen.findByRole('alert', {}, { timeout: 2000 });
    expect(alert).toHaveTextContent('Fallo de red');
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('renderiza la tabla ordenada por velocidad media', async () => {
    const mockData: Vendor[] = [
      {
        id: '1',
        vendor: 'Vendor A',
        picture: '',
        foundationDate: 0,
        antennas: [
          { technology: '2G', speedMbps: '100 Mbps' },
          { technology: '3G', speedMbps: '200 Mbps' },
        ],
      },
      {
        id: '2',
        vendor: 'Vendor B',
        picture: '',
        foundationDate: 0,
        antennas: [
          { technology: '2G', speedMbps: '50 Mbps' },
          { technology: '3G', speedMbps: '150 Mbps' },
        ],
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const Wrapper = createWrapper();

    render(<GlobalRankingPage />, { wrapper: Wrapper });

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    const caption = screen.getByText('Clasificación global por velocidad media');
    expect(caption.tagName.toLowerCase()).toBe('caption');

    const rows = screen.getAllByRole('row');
    // first row is header row. ensure the first body row corresponds to Vendor A (mayor media)
    const [_, firstDataRow, secondDataRow] = rows;
    expect(firstDataRow).toHaveTextContent('Vendor A');
    expect(secondDataRow).toHaveTextContent('Vendor B');

    const vendorLink = screen.getByRole('link', { name: /ver detalle de vendor a/i });
    expect(vendorLink).toHaveAttribute('href', '/vendor/1');
  });
});

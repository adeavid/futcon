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
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Vendor } from '../api/vendors';
import { Route as RootRoute } from '../routes/__root';
import { Route as VendorDetailRoute } from '../routes/vendor-detail';

const renderVendorDetail = async (vendorId: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const routeTree = RootRoute.addChildren([VendorDetailRoute]);
  const history = createMemoryHistory({ initialEntries: [`/vendor/${vendorId}`] });

  const router = createRouter({
    routeTree,
    history,
    context: {
      queryClient,
    },
  });

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await waitFor(() => expect(router.state.status).not.toBe('pending'));

  return { ...utils, queryClient };
};

describe('VendorDetailRoute', () => {
  const vendor: Vendor = {
    id: '1',
    vendor: 'Vendor A',
    picture: 'https://picsum.photos/64/64',
    foundationDate: 946684800000,
    antennas: [
      { technology: '2G', speedMbps: '100 Mbps' },
      { technology: '4G', speedMbps: '300 Mbps' },
    ],
  };

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('muestra estado de carga', async () => {
    const pendingPromise = new Promise<Response>(() => {});
    vi.spyOn(global, 'fetch').mockImplementation(() => pendingPromise as unknown as Promise<Response>);

    await renderVendorDetail('1');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('muestra estado de error y permite reintentar', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Fallo backend'));

    await renderVendorDetail('1');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Fallo backend');
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('renderiza detalle cuando el vendor existe', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([vendor]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await renderVendorDetail('1');

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    expect(screen.getByRole('img', { name: /logo de vendor a/i })).toBeInTheDocument();
    expect(screen.getByText(/Fundado el/)).toBeInTheDocument();
    expect(screen.getByText(/Velocidad media/)).toBeInTheDocument();
    expect(screen.getByText('Antenas disponibles')).toBeInTheDocument();
  });

  it('muestra mensaje de vendor no encontrado', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([vendor]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await renderVendorDetail('missing');

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    expect(screen.getByText(/Vendor no encontrado/)).toBeInTheDocument();
    const backLink = screen.getByRole('link', { name: /volver al ranking global/i });
    expect(backLink).toHaveAttribute('href', '/');
    await userEvent.click(backLink);
  });
});

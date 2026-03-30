import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientListPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth.context';
import { useClientSelect } from '../context/client.context';
// import toast from 'react-hot-toast';
import '@testing-library/jest-dom';
import { randAmount, randEmail, randFullName, randUuid } from '@ngneat/falso';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('../context/auth.context', () => ({ useAuth: jest.fn() }));
jest.mock('../context/client.context', () => ({ useClientSelect: jest.fn() }));
jest.mock('react-hot-toast', () => jest.fn());

const mockPaginationData = {
  data: [
    {
      name: randFullName(),
      email: randEmail(),
      salary: randAmount(),
      valuation: randAmount(),
      publicId: randUuid(),
    },
    {
      name: randFullName(),
      email: randEmail(),
      salary: randAmount(),
      valuation: randAmount(),
      publicId: randUuid(),
    },
  ],
  limit: 4,
  page: 1,
  total: 2,
  totalPages: 1,
};

describe('ClientListPage', () => {
  const mockPush = jest.fn();
  const mockAdd = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useClientSelect as jest.Mock).mockReturnValue({
      clientList: [],
      add: mockAdd,
      remove: mockRemove,
    });

    global.fetch = jest.fn();
  });

  it('redirects to /login if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      token: null,
    });

    render(<ClientListPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('fetches and displays clients when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginationData,
    });

    render(<ClientListPage />);

    // Check loading state (via pagination text)
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Finds "2" from "2 clientes encontrados"
      expect(
        screen.getByText(mockPaginationData.data[0].name),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockPaginationData.data[1].name),
      ).toBeInTheDocument();
    });
  });

  it('calls delete API when trash icon is clicked', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginationData,
    });

    render(<ClientListPage />);

    // 1. Wait for the data to actually appear in the DOM
    await waitFor(() => {
      expect(
        screen.getByText(mockPaginationData.data[0].name),
      ).toBeInTheDocument();
    });

    // 2. Now find the icons (they are guaranteed to be there now)
    const trashIcons = screen.getAllByLabelText('Trash2');
    fireEvent.click(trashIcons[0]);

    // 3. Assert fetch was called for the first client (ID '1')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        `/api/clients/${mockPaginationData.data[0].publicId}`,
      ),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('opens the InsertModal when "Criar cliente" is clicked', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginationData,
    });

    render(<ClientListPage />);

    await screen.findByText(mockPaginationData.data[0].name);

    const createBtn = screen.getByRole('button', { name: /Criar cliente/i });
    fireEvent.click(createBtn);

    expect(
      await screen.findByTestId('insert-client-modal'),
    ).toBeInTheDocument();
  });
});

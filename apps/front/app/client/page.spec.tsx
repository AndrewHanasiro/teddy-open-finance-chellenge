import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientListPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth.context';
import { useClientSelect } from '../context/client.context';
// import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('../context/auth.context', () => ({ useAuth: jest.fn() }));
jest.mock('../context/client.context', () => ({ useClientSelect: jest.fn() }));
jest.mock('react-hot-toast', () => jest.fn());

const mockPaginationData = {
  data: [
    {
      publicId: '1',
      name: 'John Doe',
      salary: 500000,
      valuation: 1000000,
      email: 'john@test.com',
    },
    {
      publicId: '2',
      name: 'Jane Smith',
      salary: 600000,
      valuation: 2000000,
      email: 'jane@test.com',
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
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
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
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // 2. Now find the icons (they are guaranteed to be there now)
    const trashIcons = screen.getAllByLabelText('Trash2');
    fireEvent.click(trashIcons[0]);

    // 3. Assert fetch was called for the first client (ID '1')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/clients/1'),
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

    await screen.findByText('John Doe');

    const createBtn = screen.getByRole('button', { name: /Criar cliente/i });
    fireEvent.click(createBtn);

    expect(await screen.findByTestId('Criar Client')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth.context';
// import toast from 'react-hot-toast';
import '@testing-library/jest-dom';
import { randFullName, randPassword, randUuid } from '@ngneat/falso';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../context/auth.context', () => ({
  useAuth: jest.fn(),
}));

// jest.mock('react-hot-toast', () => ({
//   __esModule: true,
//   default: jest.fn(),
// }));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    global.fetch = jest.fn();
  });

  it('renders login form elements', () => {
    render(<LoginPage />);

    expect(
      screen.getByPlaceholderText(/Digite o seu email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua senha/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('calls login context and redirects on successful login', async () => {
    const fakeResponse = {
      access_token: randPassword(),
      user: { id: randUuid(), name: randFullName() },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Digite o seu email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        fakeResponse.access_token,
        fakeResponse.user,
      );
      expect(mockPush).toHaveBeenCalledWith('/client');
    });
  });

  //   it('shows error toast on invalid credentials', async () => {
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: false,
  //       json: async () => ({ message: 'Credenciais inválidas' }),
  //     });

  //     render(<LoginPage />);

  //     fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

  //     await waitFor(() => {
  //       expect(toast).toHaveBeenCalledWith('Credenciais inválidas');
  //     });
  //   });

  it('navigates to register page when Cadastrar is clicked', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});

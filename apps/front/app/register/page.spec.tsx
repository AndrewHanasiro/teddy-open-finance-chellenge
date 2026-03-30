import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './page';
import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// jest.mock('react-hot-toast', () => ({
//   __esModule: true,
//   default: jest.fn(),
// }));

describe('RegisterPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    global.fetch = jest.fn();
  });

  it('renders the registration form correctly', () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText(/Qual seu nome/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite o seu email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua senha/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Registrar/i }),
    ).toBeInTheDocument();
  });

  it('redirects to /login on successful registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/Qual seu nome/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite o seu email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  // it('shows an error toast when registration fails', async () => {
  //   const errorMessage = 'Email already exists';
  //   (global.fetch as jest.Mock).mockResolvedValueOnce({
  //     ok: false,
  //     json: async () => ({ message: errorMessage }),
  //   });

  //   render(<RegisterPage />);

  //   fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

  //   await waitFor(() => {
  //     expect(toast).toHaveBeenCalledWith('Registration failed');
  //   });
  // });

  it('navigates to login page when Login button is clicked', () => {
    render(<RegisterPage />);

    const loginBtn = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginBtn);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});

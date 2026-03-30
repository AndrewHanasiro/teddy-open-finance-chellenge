import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './navigation';
import { useAuth } from '../context/auth.context';
import { randFullName } from '@ngneat/falso';

jest.mock('../context/auth.context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./sidebar', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="sidebar-mock">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('Navigation Component', () => {
  const mockLogout = jest.fn();
  const name = randFullName();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the user name from auth context', () => {
    (useAuth as any).mockReturnValue({
      user: { name },
      logout: mockLogout,
    });

    render(<Navigation />);

    expect(screen.getByText(/Olá,/i)).toBeInTheDocument();
    expect(screen.getByText(`${name}!`)).toBeInTheDocument();
  });

  it('should display "Visitante" if no user is logged in', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navigation />);

    expect(screen.getByText('Visitante!')).toBeInTheDocument();
  });

  it('should open the sidebar when the Menu icon is clicked', () => {
    (useAuth as any).mockReturnValue({
      user: { name },
      logout: mockLogout,
    });

    render(<Navigation />);

    // Initially hidden
    expect(screen.queryByTestId('sidebar-mock')).not.toBeInTheDocument();

    // Click Menu icon (it's the only lucide-react Menu component)
    const menuIcon = screen.getByRole('navigation').querySelector('svg');
    if (menuIcon) fireEvent.click(menuIcon);

    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
  });

  it('should close the sidebar when the onClose callback is triggered', () => {
    (useAuth as any).mockReturnValue({
      user: { name },
      logout: mockLogout,
    });

    render(<Navigation />);

    const menuIcon = screen.getByRole('navigation').querySelector('svg');
    if (menuIcon) fireEvent.click(menuIcon);

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByTestId('sidebar-mock')).not.toBeInTheDocument();
  });
});

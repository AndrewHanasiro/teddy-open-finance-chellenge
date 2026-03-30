import { render, screen, fireEvent } from '@testing-library/react';
import SideNav from './sidebar';
import { useRouter, usePathname } from 'next/navigation';

// Mocking Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SideNav Component', () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/home');
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <SideNav isOpen={false} onClose={mockOnClose} logout={mockLogout} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render the navigation links when open', () => {
    render(<SideNav isOpen={true} onClose={mockOnClose} logout={mockLogout} />);

    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Clientes selecionados')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should highlight the active link based on the pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/client');

    render(<SideNav isOpen={true} onClose={mockOnClose} logout={mockLogout} />);

    const clientLink = screen.getByText('Clientes').closest('a');
    expect(clientLink).toHaveClass('text-[#FF7A45]');
  });

  it('should call router.push when a navigation link is clicked', () => {
    render(<SideNav isOpen={true} onClose={mockOnClose} logout={mockLogout} />);

    fireEvent.click(screen.getByText('Clientes'));
    expect(mockPush).toHaveBeenCalledWith('/client');

    fireEvent.click(screen.getByText('Clientes selecionados'));
    expect(mockPush).toHaveBeenCalledWith('/client/select');
  });

  it('should call the logout function when Logout is clicked', () => {
    render(<SideNav isOpen={true} onClose={mockOnClose} logout={mockLogout} />);

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled(); // Logout should not trigger a route push directly from here
  });

  it('should call onClose when clicking the overlay or close button', () => {
    render(<SideNav isOpen={true} onClose={mockOnClose} logout={mockLogout} />);

    // Click the chevron/close button
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Click the overlay (first div in the fragment)
    const overlay = screen.getByRole('navigation')
      .previousSibling as HTMLElement;
    if (overlay) fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InsertModal from './insert_modal';
import toast from 'react-hot-toast';
import { randAmount, randEmail, randFullName, randUuid } from '@ngneat/falso';

jest.mock('react-hot-toast');
jest.mock('../context/auth.context', () => ({
  useAuth: () => ({ token: 'fake-token' }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('InsertModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    'data-testid': 'insert-modal',
  };
  const mockInput = {
    name: randFullName(),
    email: randEmail(),
    salary: randAmount(),
    valuation: randAmount(),
    publicId: randUuid(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should not render when isOpen is false', () => {
    render(<InsertModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('insert-modal')).not.toBeInTheDocument();
  });

  it('should render all input fields and the submit button', () => {
    render(<InsertModal {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Digite o email:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o nome:/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite o salário:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite o valor da empresa:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Cadastrar/i }),
    ).toBeInTheDocument();
  });

  it('should call onClose when clicking the close button or backdrop', () => {
    render(<InsertModal {...defaultProps} />);

    // Click close icon (X)
    fireEvent.click(screen.getByRole('button', { name: '' })); // The X button doesn't have text
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);

    // Click backdrop (the outer div)
    const modal = screen.getByTestId('insert-modal').parentElement;
    if (!modal) {
      throw new Error('Modal not found');
    }
    fireEvent.click(modal);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  it('should submit the form with correct data and converted values', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
    });

    render(<InsertModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Digite o email:/i), {
      target: { value: mockInput.email },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome:/i), {
      target: { value: mockInput.name },
    });
    fireEvent.change(screen.getByPlaceholderText(/Digite o salário:/i), {
      target: { value: mockInput.salary.toString() },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Digite o valor da empresa:/i),
      { target: { value: mockInput.valuation.toString() } },
    );

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/clients',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: mockInput.email,
            name: mockInput.name,
            salary: mockInput.salary * 100,
            valuation: mockInput.valuation * 100,
          }),
        }),
      );
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should show a toast error if the API request fails', async () => {
    const errorMessage = 'Email already exists';
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: errorMessage }),
    });

    render(<InsertModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });
});

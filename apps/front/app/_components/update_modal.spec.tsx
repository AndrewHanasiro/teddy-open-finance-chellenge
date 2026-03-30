import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateModal from './update_modal';
import { useAuth } from '../context/auth.context';
import toast from 'react-hot-toast';
import { randAmount, randEmail, randFullName, randUuid } from '@ngneat/falso';

// Mock dependencies
jest.mock('react-hot-toast');
jest.mock('../context/auth.context', () => ({
  useAuth: jest.fn(),
}));

describe('UpdateModal Component', () => {
  const mockInput = {
    name: randFullName(),
    email: randEmail(),
    salary: randAmount(),
    valuation: randAmount(),
    publicId: randUuid(),
  };

  const defaultProps = {
    isOpen: true,
    input: mockInput,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ token: 'fake-jwt-token' });
    global.fetch = jest.fn();
  });

  it('should initialize fields with the provided input data', () => {
    render(<UpdateModal {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Digite o email:/i)).toHaveValue(
      mockInput.email,
    );
    expect(screen.getByPlaceholderText(/Digite o nome:/i)).toHaveValue(
      mockInput.name,
    );
    expect(screen.getByPlaceholderText(/Digite o salário:/i)).toHaveValue(
      mockInput.salary,
    );
    expect(
      screen.getByPlaceholderText(/Digite o valor da empresa:/i),
    ).toHaveValue(mockInput.valuation);
  });

  it('should call onClose when the backdrop or close button is clicked', () => {
    render(<UpdateModal {...defaultProps} />);

    const backdrop = screen
      .getByText('Atualizar cliente')
      .closest('div')?.parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    const closeBtn = screen.getByRole('button', { name: '' }); // lucide-react X icon
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should send a PUT request with modified data and converted values', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<UpdateModal {...defaultProps} />);
    const newSalary = randAmount();
    const salaryInput = screen.getByPlaceholderText(/Digite o salário:/i);
    fireEvent.change(salaryInput, { target: { value: newSalary.toString() } });

    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/clients/${mockInput.publicId}`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-jwt-token',
          },
          body: JSON.stringify({
            email: mockInput.email,
            name: mockInput.name,
            salary: newSalary * 100,
            valuation: mockInput.valuation * 100,
          }),
        }),
      );
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should handle API errors and show a toast message', async () => {
    const errorMsg = 'Invalid data provided';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: errorMsg }),
    });

    render(<UpdateModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('should stop propagation on modal content click', () => {
    render(<UpdateModal {...defaultProps} />);

    const modalContainer = screen.getByText('Atualizar cliente').closest('div');
    if (!modalContainer) {
      throw new Error('modalContainer not found');
    }

    fireEvent.click(modalContainer);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});

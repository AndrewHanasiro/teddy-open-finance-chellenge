import React, { SubmitEvent, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/auth.context';
import toast from 'react-hot-toast';

interface SideNavProps {
  isOpen: boolean;
  input: {
    publicId: string;
    name: string;
    email: string;
    salary: number;
    valuation: number;
  };
  onClose: () => void;
}

const UpdateModal = ({ isOpen, onClose, input }: SideNavProps) => {
  const [email, setEmail] = useState(input.email);
  const [name, setName] = useState(input.name);
  const [salary, setSalary] = useState(input.salary);
  const [valuation, setValuation] = useState(input.valuation);
  const { token } = useAuth();

  const handleUpdateClient = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/clients/${input.publicId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            name,
            salary: salary * 100,
            valuation: valuation * 100,
          }),
        },
      );

      if (response.ok) {
        setEmail('');
        setName('');
        setSalary(0);
        setValuation(0);
        onClose();
      } else {
        const data = await response.json();
        toast(data.message || 'Failed to add client');
      }
    } catch (err) {
      toast(
        `An error occurred while updating client: ${(err as Error).message}`,
      );
    }
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md z-50 rounded-md bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Atualizar cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-3" onSubmit={(e) => handleUpdateClient(e)}>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Digite o email:"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Digite o nome:"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
          />
          <input
            type="number"
            step={0.01}
            min={0}
            value={salary}
            onChange={(e) => {
              setSalary(Number(e.target.value));
            }}
            placeholder="Digite o salário:"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
          />
          <input
            type="number"
            step={0.01}
            min={0}
            value={valuation}
            onChange={(e) => {
              setValuation(Number(e.target.value));
            }}
            placeholder="Digite o valor da empresa:"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full rounded bg-[#f27131] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e06328] active:scale-[0.98]"
          >
            Atualizar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;

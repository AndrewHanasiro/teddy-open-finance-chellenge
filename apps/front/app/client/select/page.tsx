'use client';

import { Plus, Minus } from 'lucide-react';
import { useClientSelect } from '../../context/client.context';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth.context';
import { useRouter } from 'next/navigation';

export default function ClientListPage() {
  const { clientList, add, remove, clean } = useClientSelect();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clientList.map((client, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                {client.name}
              </h3>
              <p className="text-sm text-gray-600">
                Salário: {formatCurrency(client.salary / 100)}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Empresa: {formatCurrency(client.valuation / 100)}
              </p>

              <div className="flex justify-between w-full pt-4 border-t border-gray-50 px-2">
                {clientList.some((c) => c.publicId === client.publicId) ? (
                  <Minus
                    size={18}
                    className="text-gray-400 hover:text-orange-500 cursor-pointer"
                    onClick={() => remove(client.publicId)}
                  />
                ) : (
                  <Plus
                    size={18}
                    className="text-gray-400 hover:text-orange-500 cursor-pointer"
                    onClick={() => add(client)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full mt-8 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded-md hover:bg-orange-50 transition-colors uppercase tracking-wide text-sm"
          onClick={() => clean()}
        >
          Limpar lista
        </button>
      </main>
    </div>
  );
}

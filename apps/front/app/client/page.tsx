'use client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth.context';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Minus,
} from 'lucide-react';
import InsertModal from '../_components/insert_modal';
import UpdateModal from '../_components/update_modal';
import { Client, useClientSelect } from '../context/client.context';

interface Pagination {
  data: Client[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const initPagination = {
  data: [],
  limit: 16,
  page: 1,
  total: 0,
  totalPages: 0,
} satisfies Pagination;

export default function ClientListPage() {
  const [selectClient, setSelectClient] = useState<Client | null>(null);
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>(initPagination);
  const { token, isAuthenticated } = useAuth();
  const { clientList, add, remove } = useClientSelect();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchClients();
  }, [limit, page, isAuthenticated]);

  const fetchClients = async () => {
    try {
      const url =
        limit || page
          ? `http://localhost:3000/api/clients?limit=${limit}&page=${page}`
          : 'http://localhost:3000/api/clients';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: Pagination = await response.json();
        setPagination(data);
      } else {
        toast('Failed to fetch clients');
      }
    } catch {
      toast('An error occurred while fetching clients.');
    }
  };

  const deleteClient = async (publicId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/clients/${publicId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        fetchClients();
      } else {
        toast('Failed to fetch clients');
      }
    } catch {
      toast('An error occurred while fetching clients.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-700">
            <span className="font-bold">{pagination.data.length}</span> clientes
            encontrados:
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Clientes por página:
            <select
              className="border rounded px-2 py-1 bg-white outline-none"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option>4</option>
              <option>8</option>
              <option>12</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagination.data.map((client, index) => (
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
                <Pencil
                  size={18}
                  data-testid={`${client.email}-edit`}
                  className="text-gray-400 hover:text-orange-500 cursor-pointer"
                  onClick={() => {
                    setSelectClient(client);
                    setIsUpdateModalOpen(true);
                  }}
                />
                <Trash2
                  aria-label="Trash2"
                  size={18}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => deleteClient(client.publicId)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          className="w-full mt-8 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded-md hover:bg-orange-50 transition-colors uppercase tracking-wide text-sm"
          onClick={() => setIsInsertModalOpen(true)}
        >
          Criar cliente
        </button>

        <div className="flex justify-center items-center gap-4 mt-8 text-sm font-medium text-gray-500">
          {pagination.page > 1 && (
            <>
              <span className="cursor-pointer">1</span>
              <span>...</span>
              <ChevronLeft onClick={() => setPage(pagination.page - 1)} />
            </>
          )}

          <span className="bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-md">
            {pagination.page}
          </span>
          {pagination.page < pagination.totalPages && (
            <>
              <ChevronRight onClick={() => setPage(pagination.page + 1)} />
              <span>...</span>
              <span className="cursor-pointer">{pagination.totalPages}</span>
            </>
          )}
        </div>
      </main>
      <InsertModal
        data-testid="insert-client-modal"
        isOpen={isInsertModalOpen}
        onClose={() => setIsInsertModalOpen(false)}
      />
      {selectClient && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          input={{
            publicId: selectClient.publicId,
            email: selectClient.email,
            name: selectClient.name,
            salary: selectClient.salary,
            valuation: selectClient.valuation,
          }}
        />
      )}
    </div>
  );
}

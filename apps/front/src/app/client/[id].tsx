'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Client {
  id: number;
  name: string;
  salary: number;
  valuation: number;
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchClientDetail(id);
    }
  }, [id]);

  const fetchClientDetail = async (clientId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/clients/${clientId}`);
      if (response.ok) {
        const data: Client = await response.json();
        setClient(data);
      } else {
        setError('Failed to fetch client details');
      }
    } catch (err) {
      setError('An error occurred while fetching client details.');
    }
  };

  const handleDeleteClient = async () => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/clients');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete client');
      }
    } catch (err) {
      setError('An error occurred while deleting client.');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!client) return <p>Loading client details...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Client Detail: {client.name}</h1>
      <p>
        <strong>Name:</strong> {client.name}
      </p>
      <p>
        <strong>Salary:</strong> ${client.salary.toLocaleString()}
      </p>
      <p>
        <strong>Valuation:</strong> ${client.valuation.toLocaleString()}
      </p>
      <button
        onClick={handleDeleteClient}
        style={{ backgroundColor: 'red', color: 'white' }}
      >
        Delete Client
      </button>
      <br />
      <br />
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}

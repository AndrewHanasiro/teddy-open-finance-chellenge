'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  salary: number;
  valuation: number;
}

export default function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3000/clients');
      if (response.ok) {
        const data: Client[] = await response.json();
        setClients(data);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (err) {
      setError('An error occurred while fetching clients.');
    }
  };

  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClientName }),
      });

      if (response.ok) {
        setNewClientName('');
        fetchClients();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add client');
      }
    } catch (err) {
      setError('An error occurred while adding client.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Client List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddClient} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New Client Name"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
          required
        />
        <button type="submit">Add New Client</button>
      </form>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <Link href={`/clients/${client.id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

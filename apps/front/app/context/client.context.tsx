'use client';
import React, { createContext, useContext, useState } from 'react';

export interface Client {
  publicId: string;
  email: string;
  name: string;
  salary: number;
  valuation: number;
}
interface ClientSelectContextType {
  clientList: Client[];
  add: (client: Client) => void;
  remove: (publicId: string) => void;
  clean: () => void;
}

const ClientSelectContext = createContext<ClientSelectContextType | undefined>(
  undefined,
);

export const ClientSelectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clientList, setClientList] = useState<Client[]>([]);

  const add = (client: Client) => {
    setClientList((prev) => [...prev, client]);
  };

  const remove = (publicId: string) => {
    setClientList((prev) =>
      prev.filter((client) => client.publicId !== publicId),
    );
  };
  const clean = () => {
    setClientList([]);
  };

  return (
    <ClientSelectContext.Provider value={{ clientList, add, remove, clean }}>
      {children}
    </ClientSelectContext.Provider>
  );
};

export const useClientSelect = () => {
  const context = useContext(ClientSelectContext);
  if (!context)
    throw new Error(
      'useClientSelect must be used within an ClientSelectProvider',
    );
  return context;
};

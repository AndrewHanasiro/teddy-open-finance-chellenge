'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Adjusted to send 'name' as per the image UI
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/clients');
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao entrar');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-6 text-3xl font-medium text-gray-800">
          Olá, seja bem-vindo!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex flex-col gap-4">
            <input
              type="email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 bg-[#fdfdfd] px-4 py-3 text-gray-600 outline-none transition-focus focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 bg-[#fdfdfd] px-4 py-3 text-gray-600 outline-none transition-focus focus:border-orange-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-sm bg-[#ef6c2d] py-3 font-bold text-white transition-colors hover:bg-[#d45a1e] active:bg-[#bc4e1a]"
          >
            Entrar
          </button>

          <button
            type="button"
            className="w-full rounded-sm bg-[#ef6c2d] py-3 font-bold text-white transition-colors hover:bg-[#d45a1e] active:bg-[#bc4e1a]"
            onClick={() => router.push('/register')}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </main>
  );
}

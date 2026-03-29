'use client';
import toast from 'react-hot-toast';
import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        toast(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast('An error occurred. Please try again.');
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
              type="text"
              placeholder="Qual seu nome:"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 bg-[#fdfdfd] px-4 py-3 text-gray-600 outline-none transition-focus focus:border-orange-500"
            />
            <input
              type="email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 bg-[#fdfdfd] px-4 py-3 text-gray-600 outline-none transition-focus focus:border-orange-500"
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 bg-[#fdfdfd] px-4 py-3 text-gray-600 outline-none transition-focus focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-sm bg-[#ef6c2d] py-3 font-bold text-white transition-colors hover:bg-[#d45a1e] active:bg-[#bc4e1a]"
          >
            Registrar
          </button>

          <button
            type="button"
            className="w-full rounded-sm bg-[#ef6c2d] py-3 font-bold text-white transition-colors hover:bg-[#d45a1e] active:bg-[#bc4e1a]"
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

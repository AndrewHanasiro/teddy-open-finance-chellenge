"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from './context/auth.context';
import { useEffect } from 'react';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/create_order");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
}

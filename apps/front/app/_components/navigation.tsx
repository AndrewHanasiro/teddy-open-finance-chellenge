'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import SideNav from './sidebar';
import { useAuth } from '../context/auth.context';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Menu
            className="text-gray-400 cursor-pointer hover:text-[#FF7A45] transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>
        <div className="text-sm">
          Olá, <span className="font-bold">{user?.name || 'Visitante'}!</span>
        </div>
      </nav>
      <SideNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} logout={logout}/>
    </>
  );
};

export default Navigation;

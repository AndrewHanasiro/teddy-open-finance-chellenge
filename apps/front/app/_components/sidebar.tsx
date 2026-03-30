import React from 'react';
import { Users, UserCheck, ChevronLeft, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
}

const SideNav = ({ isOpen, onClose, logout }: SideNavProps) => {
  const route = useRouter();
  const pathname = usePathname();
  const menuItems = [
    {
      name: 'Clientes',
      icon: Users,
      active: pathname === '/client',
      action: () => route.push('/client'),
    },
    {
      name: 'Clientes selecionados',
      icon: UserCheck,
      active: pathname === '/client/select',
      action: () => route.push('/client/select'),
    },
  ];
  if (!isOpen) return null;
  return (
    <>
      {/* Overlay: Closes the menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white p-6 font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-black text-[#FF7A45]">t</span>
              <span className="text-3xl font-black text-[#333]">eddy</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              Open Finance
            </span>
          </div>
        </div>

        {/* Close Button (Replaces the old Collapse) */}
        <div className="absolute right-[-16px] top-10">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white shadow-lg transition-transform hover:scale-105"
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <a
              key={item.name}
              className={`group relative flex items-center gap-4 rounded-lg py-2 transition-colors ${
                item.active
                  ? 'text-[#FF7A45]'
                  : 'text-black hover:text-[#FF7A45]'
              }`}
              onClick={() => item.action()}
            >
              <item.icon
                size={22}
                strokeWidth={item.active ? 2.5 : 2}
                className={item.active ? 'fill-[#FF7A45]/10' : ''}
              />
              <span
                className={`text-lg font-semibold ${item.active ? 'opacity-100' : 'opacity-90'}`}
              >
                {item.name}
              </span>
              {item.active && (
                <div className="absolute right-[-24px] h-8 w-1 rounded-l-full bg-[#FF7A45]" />
              )}
            </a>
          ))}
          <a
            id="logout"
            className={`group relative flex items-center gap-4 rounded-lg py-2 transition-colors text-black hover:text-[#FF7A45]`}
            onClick={() => logout()}
          >
            <LogOut size={22} strokeWidth={2} />
            <span className={`text-lg font-semibold opacity-90`}>Logout</span>
          </a>
        </nav>
        <div className="mt-auto h-24 w-full rounded-2xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-gray-50" />
      </div>
    </>
  );
};

export default SideNav;

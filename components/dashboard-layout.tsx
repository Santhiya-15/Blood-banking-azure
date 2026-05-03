'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/inventory', label: 'Blood Inventory', icon: '🩸' },
    { href: '/donors', label: 'Donors', icon: '👥' },
    { href: '/donations', label: 'Donations', icon: '💉' },
    { href: '/requests', label: 'Requests', icon: '📋' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  const getRoleColor = () => {
    if (!user) return 'bg-slate-600';
    switch (user.role) {
      case 'admin':
        return 'bg-red-600';
      case 'staff':
        return 'bg-blue-600';
      case 'donor':
        return 'bg-green-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-800 border-r border-slate-700 transition-all`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 1c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-white">Blood Bank</h1>
                <p className="text-xs text-slate-400">Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-700">
            {user && (
              <div className="mb-4">
                <p className="text-xs text-slate-400">Logged in as</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-8 h-8 rounded-full ${getRoleColor()} flex items-center justify-center text-white font-bold text-sm`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
            <Button
              onClick={handleLogout}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {navItems.find(item => item.href === currentPage)?.label || 'Dashboard'}
          </h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
}

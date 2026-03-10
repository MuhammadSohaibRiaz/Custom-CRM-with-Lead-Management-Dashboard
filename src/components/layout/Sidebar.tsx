'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Kanban,
  UserCog,
  BarChart3,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/types/database';

interface SidebarProps {
  role: UserRole;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'agent'] },
  { href: '/leads', label: 'Leads', icon: Users, roles: ['admin', 'agent'] },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban, roles: ['admin', 'agent'] },
  { href: '/agents', label: 'Agents', icon: UserCog, roles: ['admin'] },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'agent'] },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const nav = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center shrink-0">
          <img src="/logo.svg" alt="LeadFlow Logo" className="h-full w-full object-contain" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold text-white">LeadFlow</h1>
            <p className="text-[11px] text-slate-400">CRM Platform</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block border-t border-slate-700 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <ChevronLeft
            className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-800 p-2 text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-slate-800 transition-all duration-300 lg:relative lg:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {nav}
      </aside>
    </>
  );
}

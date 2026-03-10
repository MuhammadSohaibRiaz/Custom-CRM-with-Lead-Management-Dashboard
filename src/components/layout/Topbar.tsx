'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from '@/components/ui';
import { LogOut, Bell } from 'lucide-react';
import type { Profile } from '@/types/database';

interface TopbarProps {
  profile: Profile;
}

export default function Topbar({ profile }: TopbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
      <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
      <div className="hidden lg:block">
        <h2 className="text-sm font-medium text-gray-500">
          Welcome back, <span className="text-gray-900">{profile.full_name}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <Avatar name={profile.full_name} src={profile.avatar_url} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

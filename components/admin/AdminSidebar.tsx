'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthSession } from '@/lib/types/user.types';
import {
  LayoutDashboard,
  Music,
  Music2,
  Users,
  Award,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  session: AuthSession;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isParentActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-green-600 to-green-700 overflow-y-auto shadow-lg">
      <nav className="p-4 space-y-2">
        {/* Dashboard */}
        <Link
          href="/dcp-admin/dashboard"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/dcp-admin/dashboard')
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* โรงเรียนดนตรีไทย 100% */}
        <Link
          href="/dcp-admin/dashboard/register100"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isParentActive('/dcp-admin/dashboard/register100')
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <Music className="w-5 h-5" />
          <span className="font-medium">โรงเรียน 100%</span>
        </Link>

        {/* โรงเรียนสนับสนุนฯ */}
        <Link
          href="/dcp-admin/dashboard/register-support"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isParentActive('/dcp-admin/dashboard/register-support')
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <Music2 className="w-5 h-5" />
          <span className="font-medium">โรงเรียนสนับสนุนฯ</span>
        </Link>

        {/* User Management */}
        <div>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              isParentActive('/dcp-admin/dashboard/users')
                ? 'bg-white/20 text-white'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5" />
              <span className="font-medium">User Management</span>
            </div>
            {userMenuOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {userMenuOpen && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/dcp-admin/dashboard/users"
                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive('/dcp-admin/dashboard/users')
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                ข้อมูลเจ้าหน้าที่
              </Link>
              {session.role === 'root' && (
                <Link
                  href="/dcp-admin/dashboard/users/create"
                  className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/dcp-admin/dashboard/users/create')
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  เพิ่มเจ้าหน้าที่
                </Link>
              )}
            </div>
          )}
        </div>

        {/* e-Certificate */}
        <Link
          href="/dcp-admin/dashboard/certificates"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isParentActive('/dcp-admin/dashboard/certificates')
              ? 'bg-white/20 text-white'
              : 'text-white/80 hover:bg-white/10'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="font-medium">e-Certificate</span>
        </Link>
      </nav>
    </aside>
  );
}

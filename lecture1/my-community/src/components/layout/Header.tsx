'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import { signOut } from '@/actions/auth';
import { SITE_NAME } from '@/lib/constants/site';
import type { Profile } from '@/types';

interface HeaderProps {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

export default function Header({ user, profile }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Archive' },
    ...(user ? [
      { href: '/posts/new', label: 'Write' },
      { href: '/mypage', label: 'My Page' },
    ] : [
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'Join' },
    ]),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#E8D8B0]/95 backdrop-blur-sm border-b border-[#D4C49A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* 로고 */}
          <Link href="/" className="font-display text-xl text-[#2B3A4E] tracking-wide hover:text-[#B07A2A] transition-colors">
            {SITE_NAME}
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8" aria-label="주요 내비게이션">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-xs uppercase tracking-widest transition-colors',
                  pathname === link.href
                    ? 'text-[#B07A2A]'
                    : 'text-[#3D5060] hover:text-[#2B3A4E]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <div className="w-px h-4 bg-[#D4C49A]" />
                <div className="flex items-center gap-3">
                  <Link href="/mypage">
                    <Avatar
                      src={profile?.avatar_url}
                      alt={profile?.nickname ?? user.email ?? 'User'}
                      size={28}
                    />
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="text-[#7A8E9C] hover:text-[#9C4038] transition-colors"
                      aria-label="로그아웃"
                    >
                      <LogOut size={14} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 text-[#2B3A4E]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 모바일 드로어 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#D4C49A] bg-[#E8D8B0]">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="모바일 내비게이션">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  'py-3 text-sm uppercase tracking-widest border-b border-[#D4C49A]/50',
                  pathname === link.href ? 'text-[#B07A2A]' : 'text-[#2B3A4E]',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 py-3 text-sm uppercase tracking-widest text-[#7A8E9C] w-full"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </form>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

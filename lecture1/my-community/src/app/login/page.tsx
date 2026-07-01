import { Suspense } from 'react';
import type { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid lg:grid-cols-[1fr_480px]">
      {/* 좌측 — 에디토리얼 소개 */}
      <div className="hidden lg:flex flex-col justify-between bg-[#456070] p-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-8">
            {SITE_NAME}
          </p>
          <h1 className="font-display text-5xl xl:text-6xl text-[#F0ECE0] leading-tight mb-6">
            A Small Archive<br />
            of Everyday Life
          </h1>
          <p className="text-sm text-[#9AAAB8] leading-relaxed max-w-sm">
            {SITE_DESCRIPTION}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <hr className="border-[#F0ECE0]/10" />
          <p className="text-xs text-[#9AAAB8] uppercase tracking-widest">
            — {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* 우측 — 로그인 폼 */}
      <div className="flex flex-col justify-center px-8 sm:px-12 py-16">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-3">Login</p>
            <h2 className="font-display text-2xl text-[#2B3A4E]">아카이브에 오신걸 환영합니다</h2>
          </div>

          <Suspense>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

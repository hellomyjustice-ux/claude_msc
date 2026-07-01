'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push(next);
      });
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#D4C49A] border-t-[#B07A2A] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#7A8E9C]">인증 처리 중</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}

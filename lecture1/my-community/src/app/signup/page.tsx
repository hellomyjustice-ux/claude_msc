import type { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Join',
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-3">New Member</p>
          <h1 className="font-display text-2xl text-[#2B3A4E]">아카이브에 참여하세요</h1>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}

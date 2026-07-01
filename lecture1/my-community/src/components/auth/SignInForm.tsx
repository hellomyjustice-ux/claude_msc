'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { clientSignIn } from '@/lib/supabase/client-actions';
import { signInSchema, type SignInFormData } from '@/lib/validations/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SignInForm() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (data: SignInFormData) => {
    setServerError('');
    const result = await clientSignIn(data.email, data.password);
    if (result.error) { setServerError(result.error); return; }
    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <div className="flex flex-col gap-6">
        <Input label="이메일" type="email" autoComplete="email" placeholder="name@example.com"
          error={errors.email?.message} {...register('email')} />
        <Input label="비밀번호" type="password" autoComplete="current-password" placeholder="••••••••"
          error={errors.password?.message} {...register('password')} />
      </div>
      {serverError && <p role="alert" className="text-sm text-[#9C4038]">{serverError}</p>}
      <div className="flex flex-col gap-4">
        <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">Login</Button>
        <p className="text-center text-xs text-[#7A8E9C]">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[#2B3A4E] underline hover:text-[#B07A2A]">회원가입</Link>
        </p>
      </div>
    </form>
  );
}

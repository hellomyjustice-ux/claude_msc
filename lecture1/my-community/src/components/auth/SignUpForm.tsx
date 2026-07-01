'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientSignUp } from '@/lib/supabase/client-actions';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import { validateImageFile } from '@/lib/validations/post';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

export default function SignUpForm() {
  const [serverError, setServerError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { setAvatarError(err); return; }
    setAvatarError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: SignUpFormData) => {
    setServerError('');
    const result = await clientSignUp({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      bio: data.bio,
      avatarFile,
    });
    if (result.error) { setServerError(result.error); return; }
    router.push('/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <div className="flex flex-col gap-3">
        <label className="text-xs uppercase tracking-widest text-[#3D5060] font-medium">
          프로필 이미지 <span className="text-[#7A8E9C] normal-case">(선택)</span>
        </label>
        <div className="flex items-center gap-4">
          <Avatar src={avatarPreview} alt="미리보기" size={56} />
          <label className="cursor-pointer text-sm text-[#3D5060] underline hover:text-[#B07A2A] transition-colors">
            이미지 선택
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
              className="sr-only" onChange={handleAvatarChange} aria-label="프로필 이미지 선택" />
          </label>
        </div>
        {avatarError && <p role="alert" className="text-xs text-[#9C4038]">{avatarError}</p>}
      </div>

      <div className="flex flex-col gap-6">
        <Input label="이메일" type="email" autoComplete="email" placeholder="name@example.com"
          error={errors.email?.message} {...register('email')} />
        <Input label="비밀번호" type="password" autoComplete="new-password" placeholder="8자 이상"
          error={errors.password?.message} {...register('password')} />
        <Input label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호 재입력"
          error={errors.passwordConfirm?.message} {...register('passwordConfirm')} />
        <Input label="닉네임" placeholder="2~20자"
          error={errors.nickname?.message} {...register('nickname')} />
        <Input label="한 줄 소개" placeholder="200자 이하 (선택)"
          error={errors.bio?.message} {...register('bio')} />
      </div>

      {serverError && <p role="alert" className="text-sm text-[#9C4038]">{serverError}</p>}

      <div className="flex flex-col gap-4">
        <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">Join Archive</Button>
        <p className="text-center text-xs text-[#7A8E9C]">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#2B3A4E] underline hover:text-[#B07A2A]">로그인</Link>
        </p>
      </div>
    </form>
  );
}

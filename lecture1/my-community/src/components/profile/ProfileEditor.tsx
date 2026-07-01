'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { clientUpdateProfile } from '@/lib/supabase/client-actions';
import { profileSchema, type ProfileFormData } from '@/lib/validations/auth';
import { validateImageFile } from '@/lib/validations/post';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Toast from '@/components/ui/Toast';
import type { Profile } from '@/types';

interface ProfileEditorProps {
  profile: Profile;
  email: string;
}

export default function ProfileEditor({ profile, email }: ProfileEditorProps) {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: { nickname: profile.nickname, bio: profile.bio ?? '' },
    });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { setAvatarError(err); return; }
    setAvatarError('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileFormData) => {
    const result = await clientUpdateProfile({ nickname: data.nickname, bio: data.bio, avatarFile });
    if (result?.error) {
      setToast({ message: result.error, type: 'error' });
    } else {
      setToast({ message: '프로필이 업데이트되었습니다.', type: 'success' });
      setTimeout(() => router.push('/mypage'), 800);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex items-center gap-6">
          <Avatar src={avatarPreview} alt={profile.nickname} size={72} />
          <div className="flex flex-col gap-1">
            <label className="cursor-pointer text-sm text-[#3D5060] underline hover:text-[#B07A2A] transition-colors">
              이미지 변경
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only" onChange={handleAvatarChange} aria-label="프로필 이미지 변경" />
            </label>
            {avatarError && <p className="text-xs text-[#9C4038]">{avatarError}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-[#3D5060] font-medium">이메일</p>
          <p className="text-sm text-[#7A8E9C] py-2.5 border-b border-[#D4C49A]">{email}</p>
        </div>

        <Input label="닉네임" error={errors.nickname?.message} {...register('nickname')} />
        <Textarea label="한 줄 소개" rows={3} placeholder="200자 이하"
          error={errors.bio?.message} {...register('bio')} />

        <div className="flex items-center justify-between border-t border-[#D4C49A] pt-6">
          <Button type="button" variant="ghost" onClick={() => router.back()}>취소</Button>
          <Button type="submit" isLoading={isSubmitting}>저장</Button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

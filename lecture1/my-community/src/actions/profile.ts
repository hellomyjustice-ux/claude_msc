'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateProfileImagePath } from '@/lib/utils/format';

export async function updateProfile(formData: {
  nickname: string;
  bio?: string;
  avatarFile?: File;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: '로그인이 필요합니다.' };

  let avatarUrl: string | undefined;

  if (formData.avatarFile) {
    const storagePath = generateProfileImagePath(user.id, formData.avatarFile.name);
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(storagePath, formData.avatarFile, { upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(storagePath);
      avatarUrl = publicUrl;
    }
  }

  const updateData: Record<string, string | null> = {
    nickname: formData.nickname,
    bio: formData.bio ?? null,
  };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id);

  if (error) return { error: '프로필 수정에 실패했습니다.' };

  revalidatePath('/mypage');
  revalidatePath('/profile/edit');
  return { success: true };
}

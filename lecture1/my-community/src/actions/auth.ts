'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signUp(formData: {
  email: string;
  password: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        nickname: formData.nickname,
        bio: formData.bio ?? '',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && formData.avatarUrl) {
    await supabase
      .from('profiles')
      .update({ avatar_url: formData.avatarUrl, bio: formData.bio ?? null })
      .eq('id', data.user.id);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signIn(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

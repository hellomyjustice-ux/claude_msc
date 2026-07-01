import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProfileEditor from '@/components/profile/ProfileEditor';

export const metadata: Metadata = {
  title: 'Edit Profile',
};

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-3">Edit Profile</p>
        <h1 className="font-display text-2xl text-[#2B3A4E]">프로필 수정</h1>
      </div>

      <ProfileEditor profile={profile} email={user.email ?? ''} />
    </div>
  );
}

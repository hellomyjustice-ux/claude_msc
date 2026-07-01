'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProfileEditor from '@/components/profile/ProfileEditor';
import LoadingState from '@/components/ui/LoadingState';
import type { Profile } from '@/types';

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setEmail(user.email ?? '');
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!data) { router.push('/login'); return; }
      setProfile(data);
      setLoading(false);
    });
  }, [router]);

  if (loading) return <LoadingState />;
  if (!profile) return null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-3">Edit Profile</p>
        <h1 className="font-display text-2xl text-[#2B3A4E]">프로필 수정</h1>
      </div>
      <ProfileEditor profile={profile} email={email} />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchPosts } from '@/lib/supabase/client-actions';
import Avatar from '@/components/ui/Avatar';
import PostCard from '@/components/posts/PostCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { formatDate } from '@/lib/utils/format';
import type { Profile, PostWithDetails } from '@/types';

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setEmail(user.email ?? '');

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!data) { router.push('/login'); return; }
      setProfile(data);

      const allPosts = await fetchPosts();
      setPosts(allPosts.filter((p) => p.author_id === user.id));
      setLoading(false);
    });
  }, [router]);

  if (loading) return <LoadingState />;
  if (!profile) return null;

  const totalLikes = posts.reduce((sum, p) => sum + p.likes_count, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <section className="pb-12 mb-12 border-b border-[#D4C49A]">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-8">Member Profile</p>
        <div className="grid sm:grid-cols-[160px_1fr] gap-8 items-start">
          <Avatar src={profile.avatar_url} alt={profile.nickname} size={160} className="mx-auto sm:mx-0" />
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display text-3xl text-[#2B3A4E] mb-2">{profile.nickname}</h1>
              {profile.bio && <p className="text-sm text-[#3D5060] leading-relaxed max-w-md">{profile.bio}</p>}
            </div>
            <div className="flex gap-8">
              <div>
                <p className="font-display text-3xl text-[#2B3A4E]">{posts.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C] mt-1">Records</p>
              </div>
              <div className="w-px bg-[#D4C49A]" />
              <div>
                <p className="font-display text-3xl text-[#2B3A4E]">{totalLikes}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C] mt-1">Likes</p>
              </div>
              <div className="w-px bg-[#D4C49A]" />
              <div>
                <p className="text-sm text-[#2B3A4E]">{formatDate(profile.created_at)}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C] mt-1">Joined</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/profile/edit">
                <Button variant="secondary" size="sm"><Pencil size={12} />프로필 수정</Button>
              </Link>
            </div>
            <p className="text-xs text-[#7A8E9C]">{email}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C]">My Records</p>
          <div className="flex-1 h-px bg-[#D4C49A]" />
        </div>
        {posts.length === 0 ? (
          <EmptyState title="아직 작성한 게시글이 없습니다" description="첫 번째 기록을 남겨보세요."
            actionLabel="글 작성하기" actionHref="/posts/new" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i}
                variant={post.post_images?.length ? 'standard' : 'text'} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

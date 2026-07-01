'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchPost } from '@/lib/supabase/client-actions';
import { createClient } from '@/lib/supabase/client';
import PostForm from '@/components/posts/PostForm';
import LoadingState from '@/components/ui/LoadingState';
import type { PostWithDetails } from '@/types';

function EditPostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!id) { router.push('/'); return; }

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }

      const data = await fetchPost(id);
      if (!data) { router.push('/'); return; }
      if (data.author_id !== user.id) { setUnauthorized(true); setLoading(false); return; }

      setPost(data);
      setLoading(false);
    });
  }, [id, router]);

  if (loading) return <LoadingState />;
  if (unauthorized) return (
    <div className="text-center py-24 text-sm text-[#9C4038]">수정 권한이 없습니다.</div>
  );
  if (!post) return null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <PostForm mode="edit" post={post} />
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EditPostContent />
    </Suspense>
  );
}

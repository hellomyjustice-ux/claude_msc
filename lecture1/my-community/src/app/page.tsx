'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchPosts } from '@/lib/supabase/client-actions';
import PostGallery from '@/components/posts/PostGallery';
import CategoryFilter from '@/components/posts/CategoryFilter';
import VerticalArchivePanel from '@/components/layout/VerticalArchivePanel';
import { PostGallerySkeleton } from '@/components/ui/LoadingState';
import { createClient } from '@/lib/supabase/client';
import { SITE_DESCRIPTION } from '@/lib/constants/site';
import type { PostWithDetails } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined;

  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuth(!!user));
    fetchPosts(category).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <VerticalArchivePanel totalPosts={posts.length} currentSection={category ?? 'Home'} />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        <div className="mb-12 pb-8 border-b border-[#D4C49A]">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-4">Archive Community</p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#2B3A4E] leading-tight mb-4">
            Stories &amp; Records
          </h1>
          <p className="text-sm text-[#7A8E9C] max-w-md leading-relaxed">{SITE_DESCRIPTION}</p>
        </div>
        <div className="mb-8">
          <CategoryFilter />
        </div>
        {loading ? <PostGallerySkeleton /> : <PostGallery posts={posts} isAuthenticated={isAuth} />}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PostGallerySkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

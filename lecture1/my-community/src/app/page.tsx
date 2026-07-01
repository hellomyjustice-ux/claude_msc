import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import PostGallery from '@/components/posts/PostGallery';
import CategoryFilter from '@/components/posts/CategoryFilter';
import VerticalArchivePanel from '@/components/layout/VerticalArchivePanel';
import { PostGallerySkeleton } from '@/components/ui/LoadingState';
import { SITE_DESCRIPTION } from '@/lib/constants/site';
import type { PostWithDetails } from '@/types';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

async function PostList({ category }: { category?: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles(*),
      post_images(id, image_url, storage_path, sort_order, post_id, created_at),
      post_likes(count)
    `)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts } = await query;

  let userLikedPostIds: Set<string> = new Set();
  if (user && posts) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', posts.map((p) => p.id));

    userLikedPostIds = new Set(likes?.map((l) => l.post_id) ?? []);
  }

  const enriched: PostWithDetails[] = (posts ?? []).map((post) => ({
    ...post,
    likes_count: post.post_likes?.[0]?.count ?? 0,
    user_has_liked: userLikedPostIds.has(post.id),
  }));

  return <PostGallery posts={enriched} isAuthenticated={!!user} />;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;

  const supabase = await createClient();
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* 좌측 아카이브 패널 */}
      <VerticalArchivePanel
        totalPosts={count ?? 0}
        currentSection={category ?? 'Home'}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        {/* 에디토리얼 히어로 */}
        <div className="mb-12 pb-8 border-b border-[#D4C49A]">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A] mb-4">
            Archive Community
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#2B3A4E] leading-tight mb-4">
            Stories &amp; Records
          </h1>
          <p className="text-sm text-[#7A8E9C] max-w-md leading-relaxed">
            {SITE_DESCRIPTION}
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* 게시글 목록 */}
        <Suspense fallback={<PostGallerySkeleton />}>
          <PostList category={category} />
        </Suspense>
      </div>
    </div>
  );
}

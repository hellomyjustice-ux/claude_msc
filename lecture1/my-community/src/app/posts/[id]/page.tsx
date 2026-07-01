import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ImageGallery from '@/components/posts/ImageGallery';
import LikeButton from '@/components/posts/LikeButton';
import DeletePostButton from '@/components/posts/DeletePostButton';
import PostMeta from '@/components/posts/PostMeta';
import Button from '@/components/ui/Button';
import { formatDate, getArchiveNumber } from '@/lib/utils/format';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, content, post_images(image_url)')
    .eq('id', id)
    .single();

  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: post.post_images?.[0]?.image_url
        ? [{ url: post.post_images[0].image_url }]
        : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(*),
      post_images(id, image_url, storage_path, sort_order, post_id, created_at),
      post_likes(count)
    `)
    .eq('id', id)
    .single();

  if (!post) notFound();

  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single();
    userHasLiked = !!like;
  }

  const isAuthor = user?.id === post.author_id;
  const likesCount = post.post_likes?.[0]?.count ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* 뒤로가기 */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A8E9C] hover:text-[#2B3A4E] transition-colors mb-10">
        <ArrowLeft size={12} />
        Archive
      </Link>

      {/* 아티클 헤더 */}
      <article>
        <header className="mb-10 pb-8 border-b border-[#D4C49A]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A]">
              {getArchiveNumber(0)}
            </p>
            {post.category && (
              <span className="text-[10px] uppercase tracking-widest text-[#456070] border border-[#D4C49A] px-2 py-0.5">
                {post.category}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-[#2B3A4E] leading-snug mb-6">
            {post.title}
          </h1>

          <PostMeta
            author={post.profiles}
            createdAt={post.created_at}
            likesCount={likesCount}
            imagesCount={post.post_images?.length}
            size="md"
          />

          {/* 작성자 전용 버튼 */}
          {isAuthor && (
            <div className="flex items-center gap-2 mt-6">
              <Link href={`/posts/${id}/edit`}>
                <Button variant="secondary" size="sm">
                  <Pencil size={12} />
                  수정
                </Button>
              </Link>
              <DeletePostButton postId={id} />
            </div>
          )}
        </header>

        {/* 이미지 갤러리 */}
        {post.post_images && post.post_images.length > 0 && (
          <div className="mb-10">
            <ImageGallery images={post.post_images} title={post.title} />
          </div>
        )}

        {/* 본문 */}
        <div className="prose prose-sm max-w-none">
          <div className="text-[#3D5060] text-base leading-loose whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* 하단 메타 */}
        <footer className="mt-12 pt-8 border-t border-[#D4C49A] flex items-center justify-between">
          <p className="text-xs text-[#7A8E9C]">{formatDate(post.created_at)}</p>
          <LikeButton
            postId={id}
            initialCount={likesCount}
            initialLiked={userHasLiked}
            isAuthenticated={!!user}
          />
        </footer>
      </article>
    </div>
  );
}

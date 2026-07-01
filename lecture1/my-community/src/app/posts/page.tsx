'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { fetchPost } from '@/lib/supabase/client-actions';
import { createClient } from '@/lib/supabase/client';
import ImageGallery from '@/components/posts/ImageGallery';
import LikeButton from '@/components/posts/LikeButton';
import DeletePostButton from '@/components/posts/DeletePostButton';
import PostMeta from '@/components/posts/PostMeta';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import { formatDate, getArchiveNumber } from '@/lib/utils/format';
import type { PostWithDetails } from '@/types';

function PostDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { router.push('/'); return; }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));
    fetchPost(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [id, router]);

  if (loading) return <LoadingState label="게시글 불러오는 중" />;
  if (!post) return (
    <div className="text-center py-24">
      <p className="text-sm text-[#7A8E9C]">게시글을 찾을 수 없습니다.</p>
      <Link href="/" className="text-xs underline text-[#B07A2A] mt-4 inline-block">홈으로</Link>
    </div>
  );

  const isAuthor = userId === post.author_id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#7A8E9C] hover:text-[#2B3A4E] transition-colors mb-10">
        <ArrowLeft size={12} />
        Archive
      </Link>

      <article>
        <header className="mb-10 pb-8 border-b border-[#D4C49A]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B07A2A]">{getArchiveNumber(0)}</p>
            {post.category && (
              <span className="text-[10px] uppercase tracking-widest text-[#456070] border border-[#D4C49A] px-2 py-0.5">
                {post.category}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#2B3A4E] leading-snug mb-6">{post.title}</h1>
          <PostMeta author={post.profiles} createdAt={post.created_at} likesCount={post.likes_count}
            imagesCount={post.post_images?.length} size="md" />
          {isAuthor && (
            <div className="flex items-center gap-2 mt-6">
              <Link href={`/posts/edit?id=${post.id}`}>
                <Button variant="secondary" size="sm"><Pencil size={12} />수정</Button>
              </Link>
              <DeletePostButton postId={post.id} onDeleted={() => router.push('/')} />
            </div>
          )}
        </header>

        {post.post_images && post.post_images.length > 0 && (
          <div className="mb-10">
            <ImageGallery images={post.post_images} title={post.title} />
          </div>
        )}

        <div className="text-[#3D5060] text-base leading-loose whitespace-pre-wrap">{post.content}</div>

        <footer className="mt-12 pt-8 border-t border-[#D4C49A] flex items-center justify-between">
          <p className="text-xs text-[#7A8E9C]">{formatDate(post.created_at)}</p>
          <LikeButton postId={post.id} initialCount={post.likes_count}
            initialLiked={post.user_has_liked} isAuthenticated={!!userId} />
        </footer>
      </article>
    </div>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={<LoadingState label="게시글 불러오는 중" />}>
      <PostDetail />
    </Suspense>
  );
}

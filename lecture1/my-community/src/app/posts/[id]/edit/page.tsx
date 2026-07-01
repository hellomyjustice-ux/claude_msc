import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/posts/PostForm';
import type { PostWithDetails } from '@/types';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Entry',
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

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
  if (post.author_id !== user.id) redirect('/');

  const enriched: PostWithDetails = {
    ...post,
    likes_count: post.post_likes?.[0]?.count ?? 0,
    user_has_liked: false,
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <PostForm mode="edit" post={enriched} />
    </div>
  );
}

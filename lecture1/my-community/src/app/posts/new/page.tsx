import type { Metadata } from 'next';
import PostForm from '@/components/posts/PostForm';

export const metadata: Metadata = {
  title: 'New Entry',
};

export default function NewPostPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <PostForm mode="create" />
    </div>
  );
}

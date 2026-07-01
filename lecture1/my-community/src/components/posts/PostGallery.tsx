import PostCard from './PostCard';
import EmptyState from '@/components/ui/EmptyState';
import type { PostWithDetails } from '@/types';

interface PostGalleryProps {
  posts: PostWithDetails[];
  isAuthenticated?: boolean;
}

export default function PostGallery({ posts, isAuthenticated }: PostGalleryProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title="아직 게시글이 없습니다"
        description="첫 번째 기록을 남겨보세요."
        actionLabel={isAuthenticated ? '글 작성하기' : undefined}
        actionHref={isAuthenticated ? '/posts/new' : undefined}
      />
    );
  }

  const [firstPost, ...restPosts] = posts;

  return (
    <div className="flex flex-col gap-8">
      {/* 첫 번째 게시글 — 대형 카드 */}
      <PostCard post={firstPost} index={0} variant="large" />

      {/* 나머지 게시글 — 3열 그리드 */}
      {restPosts.length > 0 && (
        <>
          <hr className="border-[#D4C49A]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restPosts.map((post, i) => {
              const hasImage = post.post_images && post.post_images.length > 0;
              const variant = hasImage ? 'standard' : 'text';
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i + 1}
                  variant={variant}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import PostMeta from './PostMeta';
import { truncate, getArchiveNumber } from '@/lib/utils/format';
import type { PostWithDetails } from '@/types';

interface PostCardProps {
  post: PostWithDetails;
  index: number;
  variant?: 'large' | 'standard' | 'text';
}

export default function PostCard({ post, index, variant = 'standard' }: PostCardProps) {
  const coverImage = post.post_images?.[0];
  const archiveNumber = getArchiveNumber(index);

  if (variant === 'text' || !coverImage) {
    return (
      <Link href={`/posts/${post.id}`} className="group block">
        <article className="border border-[#D4C49A] p-6 hover:border-[#B07A2A] transition-colors duration-200 h-full flex flex-col justify-between gap-6 bg-[#D4C49A]/20">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#B07A2A]">{archiveNumber}</span>
              {post.category && (
                <span className="text-[10px] uppercase tracking-widest text-[#456070] border border-[#D4C49A] px-2 py-0.5">
                  {post.category}
                </span>
              )}
            </div>
            <h2 className="font-display text-xl text-[#2B3A4E] group-hover:text-[#B07A2A] transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-[#3D5060] leading-relaxed">
              {truncate(post.content, 120)}
            </p>
          </div>
          <PostMeta
            author={post.profiles}
            createdAt={post.created_at}
            likesCount={post.likes_count}
            imagesCount={post.post_images?.length}
            size="sm"
          />
        </article>
      </Link>
    );
  }

  if (variant === 'large') {
    return (
      <Link href={`/posts/${post.id}`} className="group block">
        <article className="grid md:grid-cols-[1fr_320px] gap-0 border border-[#D4C49A] hover:border-[#B07A2A] transition-colors duration-200">
          <div className="relative overflow-hidden aspect-[3/2] md:aspect-auto md:min-h-[320px] bg-[#D4C49A]">
            <Image
              src={coverImage.image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="p-8 flex flex-col justify-between gap-8 bg-[#E8D8B0]">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-widest text-[#B07A2A]">{archiveNumber}</span>
              <h2 className="font-display text-2xl text-[#2B3A4E] group-hover:text-[#B07A2A] transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-[#3D5060] leading-relaxed">
                {truncate(post.content, 180)}
              </p>
            </div>
            <PostMeta
              author={post.profiles}
              createdAt={post.created_at}
              likesCount={post.likes_count}
              imagesCount={post.post_images?.length}
              category={post.category}
              size="md"
            />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <article className="flex flex-col gap-3">
        <div className="relative overflow-hidden aspect-[4/3] bg-[#D4C49A]">
          <Image
            src={coverImage.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-400"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#B07A2A]">{archiveNumber}</span>
          <h2 className="text-base font-medium text-[#2B3A4E] group-hover:text-[#B07A2A] transition-colors leading-snug">
            {truncate(post.title, 60)}
          </h2>
          <PostMeta
            author={post.profiles}
            createdAt={post.created_at}
            likesCount={post.likes_count}
            imagesCount={post.post_images?.length}
            category={post.category}
            size="sm"
          />
        </div>
      </article>
    </Link>
  );
}

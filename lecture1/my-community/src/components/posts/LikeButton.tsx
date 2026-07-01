'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/actions/posts';

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
}

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isPending) return;

    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    startTransition(async () => {
      const result = await toggleLike(postId);
      if (result?.error) {
        // 롤백
        setLiked((prev) => !prev);
        setCount((prev) => (liked ? prev + 1 : prev - 1));
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      aria-pressed={liked}
      className={[
        'flex items-center gap-2 px-4 py-2 border transition-colors duration-200 text-sm',
        liked
          ? 'border-[#B07A2A] text-[#B07A2A] bg-[#B07A2A]/10'
          : 'border-[#D4C49A] text-[#7A8E9C] hover:border-[#B07A2A] hover:text-[#B07A2A]',
        isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer',
      ].join(' ')}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      <span>{count}</span>
    </button>
  );
}

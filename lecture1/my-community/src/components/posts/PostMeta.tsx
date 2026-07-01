import { Heart, Images, Calendar } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { formatDateShort } from '@/lib/utils/format';
import type { Profile } from '@/types';

interface PostMetaProps {
  author: Profile;
  createdAt: string;
  likesCount: number;
  imagesCount?: number;
  category?: string | null;
  archiveNumber?: string;
  size?: 'sm' | 'md';
}

export default function PostMeta({
  author,
  createdAt,
  likesCount,
  imagesCount,
  category,
  archiveNumber,
  size = 'sm',
}: PostMetaProps) {
  const isSmall = size === 'sm';

  return (
    <div className="flex flex-col gap-2">
      {/* 카테고리 + 아카이브 번호 */}
      <div className="flex items-center gap-3">
        {archiveNumber && (
          <span className="text-[10px] uppercase tracking-widest text-[#B07A2A] font-medium">
            {archiveNumber}
          </span>
        )}
        {category && (
          <span className="text-[10px] uppercase tracking-widest text-[#456070] border border-[#D4C49A] px-2 py-0.5">
            {category}
          </span>
        )}
      </div>

      {/* 작성자 */}
      <div className="flex items-center gap-2">
        <Avatar
          src={author.avatar_url}
          alt={author.nickname}
          size={isSmall ? 20 : 28}
        />
        <span className={`text-[#3D5060] ${isSmall ? 'text-xs' : 'text-sm'}`}>
          {author.nickname}
        </span>
      </div>

      {/* 날짜 + 통계 */}
      <div className="flex items-center gap-3 text-[#7A8E9C]">
        <span className="flex items-center gap-1 text-[10px]">
          <Calendar size={10} />
          {formatDateShort(createdAt)}
        </span>
        <span className="flex items-center gap-1 text-[10px]">
          <Heart size={10} />
          {likesCount}
        </span>
        {imagesCount !== undefined && imagesCount > 0 && (
          <span className="flex items-center gap-1 text-[10px]">
            <Images size={10} />
            {imagesCount}
          </span>
        )}
      </div>
    </div>
  );
}

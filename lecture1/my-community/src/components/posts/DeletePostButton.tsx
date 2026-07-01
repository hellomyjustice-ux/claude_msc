'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/actions/posts';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await deletePost(postId);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-[#9C4038] hover:text-[#9C4038] hover:border-[#9C4038]"
      >
        <Trash2 size={14} />
        삭제
      </Button>

      <ConfirmModal
        isOpen={open}
        title="게시글 삭제"
        message="이 게시글을 삭제하면 관련 이미지와 좋아요 데이터도 함께 삭제됩니다. 계속하시겠습니까?"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        isLoading={isPending}
      />
    </>
  );
}

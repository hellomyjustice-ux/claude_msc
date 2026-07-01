'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/actions/posts';
import { postSchema, type PostFormData } from '@/lib/validations/post';
import { CATEGORIES } from '@/lib/constants/site';
import NextImage from 'next/image';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageUploader, { type UploadedImage } from './ImageUploader';
import type { PostWithDetails, PostImage } from '@/types';

interface ExistingImage extends PostImage {
  markedForDelete?: boolean;
}

interface PostFormProps {
  mode: 'create' | 'edit';
  post?: PostWithDetails;
}

export default function PostForm({ mode, post }: PostFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [newImages, setNewImages] = useState<UploadedImage[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    post?.post_images ?? []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      content: post?.content ?? '',
      category: post?.category ?? '',
    },
  });

  const toggleDeleteExisting = (id: string) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, markedForDelete: !img.markedForDelete } : img
      )
    );
  };

  const onSubmit = async (data: PostFormData) => {
    setServerError('');

    const invalidImages = newImages.filter((img) => img.error);
    if (invalidImages.length > 0) {
      setServerError('업로드할 수 없는 이미지가 있습니다. 확인 후 다시 시도해주세요.');
      return;
    }

    if (mode === 'create') {
      const result = await createPost({
        title: data.title,
        content: data.content,
        category: data.category,
        images: newImages.map((img) => ({ file: img.file, sortOrder: img.sortOrder })),
      });
      if (result?.error) setServerError(result.error);
    } else if (post) {
      const toDelete = existingImages.filter((img) => img.markedForDelete);
      const result = await updatePost(post.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        newImages: newImages.map((img) => ({ file: img.file, sortOrder: img.sortOrder })),
        deletedImageIds: toDelete.map((img) => img.id),
        deletedStoragePaths: toDelete.map((img) => img.storage_path),
      });
      if (result?.error) setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      {/* 헤더 라벨 */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B07A2A]">
          {mode === 'create' ? 'New Entry' : 'Edit Entry'}
        </span>
        <div className="flex-1 h-px bg-[#D4C49A]" />
      </div>

      {/* 제목 */}
      <div>
        <Input
          label="제목"
          placeholder="제목을 입력하세요"
          error={errors.title?.message}
          className="text-2xl font-display py-3"
          {...register('title')}
        />
      </div>

      {/* 카테고리 */}
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-[#3D5060] font-medium">카테고리 (선택)</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input
                type="radio"
                value={cat}
                className="sr-only peer"
                {...register('category')}
              />
              <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#D4C49A] text-[#3D5060] peer-checked:border-[#B07A2A] peer-checked:bg-[#B07A2A] peer-checked:text-[#F0ECE0] transition-colors cursor-pointer inline-block">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 이미지 업로더 */}
      <div>
        {/* 기존 이미지 (수정 모드) */}
        {mode === 'edit' && existingImages.length > 0 && (
          <div className="flex flex-col gap-3 mb-6">
            <p className="text-xs uppercase tracking-widest text-[#3D5060] font-medium">기존 이미지</p>
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div
                    className={`relative aspect-square overflow-hidden bg-[#D4C49A] cursor-pointer ${
                      img.markedForDelete ? 'opacity-40 ring-2 ring-[#9C4038]' : ''
                    }`}
                    onClick={() => toggleDeleteExisting(img.id)}
                  >
                    <NextImage src={img.image_url} alt="" fill className="object-cover" sizes="150px" />
                    {img.markedForDelete && (
                      <div className="absolute inset-0 flex items-center justify-center text-[#9C4038] text-xs font-medium bg-white/60">
                        삭제 예정
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDeleteExisting(img.id)}
                    className="text-[10px] text-[#7A8E9C] underline mt-1 block"
                  >
                    {img.markedForDelete ? '취소' : '삭제'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ImageUploader images={newImages} onChange={setNewImages} />
      </div>

      {/* 본문 */}
      <Textarea
        label="본문"
        placeholder="이야기를 기록해주세요"
        rows={12}
        error={errors.content?.message}
        {...register('content')}
      />

      {serverError && (
        <p role="alert" className="text-sm text-[#9C4038]">{serverError}</p>
      )}

      <div className="flex items-center justify-between border-t border-[#D4C49A] pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === 'create' ? 'Publish' : 'Update'}
        </Button>
      </div>
    </form>
  );
}

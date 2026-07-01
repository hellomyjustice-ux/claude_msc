'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { validateImageFile } from '@/lib/validations/post';
import { IMAGE_LIMITS } from '@/lib/constants/site';

export interface UploadedImage {
  file: File;
  preview: string;
  sortOrder: number;
  error?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (files: FileList | File[]) => {
    const remaining = IMAGE_LIMITS.maxCount - images.length;
    if (remaining <= 0) return;

    const fileArray = Array.from(files).slice(0, remaining);
    const newImages: UploadedImage[] = fileArray.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      sortOrder: images.length + i,
      error: validateImageFile(file) ?? undefined,
    }));

    onChange([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, sortOrder: i }));
    onChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const canAdd = images.length < IMAGE_LIMITS.maxCount;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-[#3D5060] font-medium">
        이미지 첨부 <span className="text-[#7A8E9C] normal-case tracking-normal">({images.length}/{IMAGE_LIMITS.maxCount})</span>
      </p>

      {/* 드롭존 */}
      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            'w-full border-2 border-dashed py-10 flex flex-col items-center gap-3 transition-colors duration-200 cursor-pointer',
            isDragging ? 'border-[#B07A2A] bg-[#B07A2A]/5' : 'border-[#D4C49A] hover:border-[#B07A2A] hover:bg-[#D4C49A]/20',
          ].join(' ')}
          aria-label="이미지 추가"
        >
          <Upload size={20} className="text-[#7A8E9C]" />
          <div className="text-center">
            <p className="text-sm text-[#3D5060]">클릭하거나 파일을 드래그해주세요</p>
            <p className="text-xs text-[#7A8E9C] mt-1">
              {IMAGE_LIMITS.allowedExtensions.join(', ')} · 최대 {IMAGE_LIMITS.maxSizeMB}MB
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_LIMITS.allowedTypes.join(',')}
        multiple
        className="sr-only"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        aria-hidden="true"
      />

      {/* 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <div className={`relative aspect-square overflow-hidden bg-[#D4C49A] ${img.error ? 'ring-2 ring-[#9C4038]' : ''}`}>
                <Image
                  src={img.preview}
                  alt={`미리보기 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-[#2B3A4E]/70 text-[#F0ECE0] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`이미지 ${i + 1} 삭제`}
                >
                  <X size={12} />
                </button>
              </div>
              {img.error && (
                <p className="text-[10px] text-[#9C4038] mt-1">{img.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

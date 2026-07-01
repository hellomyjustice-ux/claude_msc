'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PostImage } from '@/types';

interface ImageGalleryProps {
  images: PostImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + sorted.length) % sorted.length : 0));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % sorted.length : 0));

  return (
    <>
      <div className="flex flex-col gap-4">
        {sorted.map((img, i) => (
          <button
            key={img.id}
            onClick={() => openLightbox(i)}
            className="relative w-full cursor-zoom-in overflow-hidden bg-[#D4C49A] group"
            aria-label={`이미지 ${i + 1} 확대`}
          >
            <Image
              src={img.image_url}
              alt={`${title} — 이미지 ${i + 1}`}
              width={900}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </button>
        ))}
      </div>

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#1E2B38]/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-[#F0ECE0] hover:text-[#B07A2A] transition-colors"
            onClick={closeLightbox}
            aria-label="닫기"
          >
            <X size={24} />
          </button>

          {sorted.length > 1 && (
            <>
              <button
                className="absolute left-4 text-[#F0ECE0] hover:text-[#B07A2A] transition-colors"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="이전 이미지"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 text-[#F0ECE0] hover:text-[#B07A2A] transition-colors"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="다음 이미지"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[90vh] px-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={sorted[lightboxIndex].image_url}
              alt={`${title} — 이미지 ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain mx-auto"
              sizes="90vw"
            />
            <p className="text-center text-xs text-[#7A8E9C] mt-3">
              {lightboxIndex + 1} / {sorted.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

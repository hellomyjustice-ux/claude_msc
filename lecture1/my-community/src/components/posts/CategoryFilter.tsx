'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants/site';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') ?? '';

  const handleSelect = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === active) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
      <button
        onClick={() => handleSelect('')}
        className={[
          'text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors duration-200',
          active === ''
            ? 'border-[#2B3A4E] bg-[#2B3A4E] text-[#F0ECE0]'
            : 'border-[#D4C49A] text-[#3D5060] hover:border-[#2B3A4E]',
        ].join(' ')}
        aria-pressed={active === ''}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={[
            'text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors duration-200',
            active === cat
              ? 'border-[#B07A2A] bg-[#B07A2A] text-[#F0ECE0]'
              : 'border-[#D4C49A] text-[#3D5060] hover:border-[#B07A2A]',
          ].join(' ')}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

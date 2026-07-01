import { SITE_NAME } from '@/lib/constants/site';

interface VerticalArchivePanelProps {
  totalPosts?: number;
  currentSection?: string;
}

export default function VerticalArchivePanel({
  totalPosts = 0,
  currentSection = 'Home',
}: VerticalArchivePanelProps) {
  const year = new Date().getFullYear();

  return (
    <aside className="hidden lg:flex flex-col w-[200px] shrink-0 border-r border-[#D4C49A] min-h-[calc(100vh-3.5rem)] sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden bg-[#E8D8B0]">
      <div className="flex flex-col h-full p-6 gap-8">
        {/* 섹션 정보 */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C]">Section</p>
          <p className="text-sm text-[#2B3A4E] font-medium">{currentSection}</p>
        </div>

        <hr className="border-[#D4C49A]" />

        {/* 아카이브 통계 */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C] mb-1">Archive</p>
            <p className="font-display text-3xl text-[#2B3A4E]">{String(totalPosts).padStart(3, '0')}</p>
            <p className="text-[10px] text-[#7A8E9C] mt-1">Records</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#7A8E9C] mb-1">Year</p>
            <p className="text-sm text-[#3D5060]">{year}</p>
          </div>
        </div>

        <hr className="border-[#D4C49A]" />

        {/* 소개 문구 */}
        <div>
          <p className="text-xs text-[#7A8E9C] leading-relaxed">
            일상의 장면과 이야기를 기록하는 작은 아카이브
          </p>
        </div>

        {/* 하단 장식 세로 텍스트 */}
        <div className="mt-auto flex justify-center">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#D4C49A] font-display"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {SITE_NAME} · {year}
          </p>
        </div>
      </div>
    </aside>
  );
}

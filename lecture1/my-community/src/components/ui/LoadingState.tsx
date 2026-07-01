export default function LoadingState({ label = '불러오는 중' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-8 h-8 border-2 border-[#D4C49A] border-t-[#B07A2A] rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-[#7A8E9C]">{label}</p>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#D4C49A] aspect-[4/3] w-full mb-3" />
      <div className="h-3 bg-[#D4C49A] w-1/4 mb-2" />
      <div className="h-5 bg-[#D4C49A] w-3/4 mb-2" />
      <div className="h-3 bg-[#D4C49A] w-1/2" />
    </div>
  );
}

export function PostGallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

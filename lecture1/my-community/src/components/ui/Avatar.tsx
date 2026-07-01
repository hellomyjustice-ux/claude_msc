import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  if (src) {
    return (
      <div
        className={`relative rounded-full overflow-hidden bg-[#D4C49A] shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} />
      </div>
    );
  }

  const initials = alt.slice(0, 1).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#456070] text-[#F0ECE0] font-medium shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={alt}
    >
      {initials}
    </div>
  );
}

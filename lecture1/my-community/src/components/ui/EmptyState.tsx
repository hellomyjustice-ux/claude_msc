import Link from 'next/link';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="w-12 h-px bg-[#D4C49A]" />
      <div>
        <p className="text-sm uppercase tracking-widest text-[#7A8E9C] mb-2">{title}</p>
        {description && <p className="text-sm text-[#7A8E9C] max-w-xs">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="secondary" size="sm">{actionLabel}</Button>
        </Link>
      )}
      <div className="w-12 h-px bg-[#D4C49A]" />
    </div>
  );
}

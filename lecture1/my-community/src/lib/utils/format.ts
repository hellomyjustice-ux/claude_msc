export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function generateStoragePath(userId: string, postId: string, filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  return `${userId}/${postId}/${uniqueName}`;
}

export function generateProfileImagePath(userId: string, filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  return `${userId}/${uniqueName}`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
}

export function getArchiveNumber(index: number): string {
  return `#${String(index + 1).padStart(3, '0')}`;
}

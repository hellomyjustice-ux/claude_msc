import { z } from 'zod';
import { IMAGE_LIMITS, POST_LIMITS } from '@/lib/constants/site';

export const postSchema = z.object({
  title: z
    .string()
    .min(POST_LIMITS.titleMin, `제목은 ${POST_LIMITS.titleMin}자 이상이어야 합니다.`)
    .max(POST_LIMITS.titleMax, `제목은 ${POST_LIMITS.titleMax}자 이하여야 합니다.`),
  content: z
    .string()
    .min(POST_LIMITS.contentMin, '본문을 입력해주세요.')
    .max(POST_LIMITS.contentMax, `본문은 ${POST_LIMITS.contentMax}자 이하여야 합니다.`),
  category: z
    .string()
    .max(POST_LIMITS.categoryMax, `카테고리는 ${POST_LIMITS.categoryMax}자 이하여야 합니다.`)
    .optional(),
});

export function validateImageFile(file: File): string | null {
  if (!IMAGE_LIMITS.allowedTypes.includes(file.type as typeof IMAGE_LIMITS.allowedTypes[number])) {
    return `지원하지 않는 파일 형식입니다. (${IMAGE_LIMITS.allowedExtensions.join(', ')})`;
  }
  if (file.size > IMAGE_LIMITS.maxSizeBytes) {
    return `파일 크기는 ${IMAGE_LIMITS.maxSizeMB}MB 이하여야 합니다.`;
  }
  return null;
}

export type PostFormData = z.infer<typeof postSchema>;

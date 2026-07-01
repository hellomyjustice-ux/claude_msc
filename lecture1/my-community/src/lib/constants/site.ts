export const SITE_NAME = 'Archive Community';
export const SITE_DESCRIPTION = '일상의 장면과 이야기를 기록하는 작은 아카이브';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const CATEGORIES = [
  '일상',
  '여행',
  '사진',
  '음식',
  '도시',
  '자연',
  '기록',
  '기타',
] as const;

export const IMAGE_LIMITS = {
  maxCount: 5,
  maxSizeMB: 10,
  maxSizeBytes: 10 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
} as const;

export const POST_LIMITS = {
  titleMin: 2,
  titleMax: 100,
  contentMin: 1,
  contentMax: 10000,
  bioMax: 200,
  categoryMax: 30,
} as const;

export const PROFILE_LIMITS = {
  nicknameMin: 2,
  nicknameMax: 20,
} as const;

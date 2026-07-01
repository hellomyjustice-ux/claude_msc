import { z } from 'zod';
import { POST_LIMITS, PROFILE_LIMITS } from '@/lib/constants/site';

export const signUpSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(100, '비밀번호는 100자 이하여야 합니다.'),
    passwordConfirm: z.string(),
    nickname: z
      .string()
      .min(PROFILE_LIMITS.nicknameMin, `닉네임은 ${PROFILE_LIMITS.nicknameMin}자 이상이어야 합니다.`)
      .max(PROFILE_LIMITS.nicknameMax, `닉네임은 ${PROFILE_LIMITS.nicknameMax}자 이하여야 합니다.`),
    bio: z
      .string()
      .max(POST_LIMITS.bioMax, `소개는 ${POST_LIMITS.bioMax}자 이하여야 합니다.`)
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export const signInSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(PROFILE_LIMITS.nicknameMin, `닉네임은 ${PROFILE_LIMITS.nicknameMin}자 이상이어야 합니다.`)
    .max(PROFILE_LIMITS.nicknameMax, `닉네임은 ${PROFILE_LIMITS.nicknameMax}자 이하여야 합니다.`),
  bio: z
    .string()
    .max(POST_LIMITS.bioMax, `소개는 ${POST_LIMITS.bioMax}자 이하여야 합니다.`)
    .optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

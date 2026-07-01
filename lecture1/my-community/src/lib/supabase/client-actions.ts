import { createClient } from './client';
import { generateStoragePath, generateProfileImagePath } from '../utils/format';
import type { PostWithDetails } from '@/types';

/* ── Auth ──────────────────────────────────────────────── */

export async function clientSignIn(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  return { success: true };
}

export async function clientSignUp(formData: {
  email: string;
  password: string;
  nickname: string;
  bio?: string;
  avatarFile?: File | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { nickname: formData.nickname, bio: formData.bio ?? '' },
    },
  });

  if (error) return { error: error.message };

  if (data.user && formData.avatarFile) {
    const storagePath = generateProfileImagePath(data.user.id, formData.avatarFile.name);
    const { error: uploadErr } = await supabase.storage
      .from('profile-images')
      .upload(storagePath, formData.avatarFile);

    if (!uploadErr) {
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(storagePath);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', data.user.id);
    }
  }

  return { success: true };
}

export async function clientSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/* ── Queries ───────────────────────────────────────────── */

export async function fetchPosts(category?: string): Promise<PostWithDetails[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles(*),
      post_images(id, image_url, storage_path, sort_order, post_id, created_at),
      post_likes(count)
    `)
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);

  const { data: posts } = await query;
  if (!posts) return [];

  let likedIds = new Set<string>();
  if (user) {
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', posts.map((p) => p.id));
    likedIds = new Set(likes?.map((l) => l.post_id) ?? []);
  }

  return posts.map((post) => ({
    ...post,
    likes_count: post.post_likes?.[0]?.count ?? 0,
    user_has_liked: likedIds.has(post.id),
  }));
}

export async function fetchPost(id: string): Promise<PostWithDetails | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(*),
      post_images(id, image_url, storage_path, sort_order, post_id, created_at),
      post_likes(count)
    `)
    .eq('id', id)
    .single();

  if (!post) return null;

  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single();
    userHasLiked = !!like;
  }

  return {
    ...post,
    likes_count: post.post_likes?.[0]?.count ?? 0,
    user_has_liked: userHasLiked,
  };
}

/* ── Post Mutations ────────────────────────────────────── */

export async function clientCreatePost(formData: {
  title: string;
  content: string;
  category?: string;
  images: { file: File; sortOrder: number }[];
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: formData.title,
      content: formData.content,
      category: formData.category || null,
    })
    .select()
    .single();

  if (error || !post) return { error: error?.message ?? '게시글 작성에 실패했습니다.' };

  for (const { file, sortOrder } of formData.images) {
    const storagePath = generateStoragePath(user.id, post.id, file.name);
    const { error: upErr } = await supabase.storage.from('post-images').upload(storagePath, file);
    if (upErr) continue;
    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(storagePath);
    await supabase.from('post_images').insert({
      post_id: post.id,
      storage_path: storagePath,
      image_url: publicUrl,
      sort_order: sortOrder,
    });
  }

  return { postId: post.id };
}

export async function clientUpdatePost(
  postId: string,
  formData: {
    title: string;
    content: string;
    category?: string;
    newImages: { file: File; sortOrder: number }[];
    deletedImageIds: string[];
    deletedStoragePaths: string[];
  }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('posts')
    .update({ title: formData.title, content: formData.content, category: formData.category || null })
    .eq('id', postId)
    .eq('author_id', user.id);

  if (error) return { error: '게시글 수정에 실패했습니다.' };

  for (const id of formData.deletedImageIds) {
    await supabase.from('post_images').delete().eq('id', id);
  }
  if (formData.deletedStoragePaths.length > 0) {
    await supabase.storage.from('post-images').remove(formData.deletedStoragePaths);
  }

  for (const { file, sortOrder } of formData.newImages) {
    const storagePath = generateStoragePath(user.id, postId, file.name);
    const { error: upErr } = await supabase.storage.from('post-images').upload(storagePath, file);
    if (upErr) continue;
    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(storagePath);
    await supabase.from('post_images').insert({
      post_id: postId, storage_path: storagePath, image_url: publicUrl, sort_order: sortOrder,
    });
  }

  return { success: true };
}

export async function clientDeletePost(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: images } = await supabase
    .from('post_images').select('storage_path').eq('post_id', postId);

  if (images?.length) {
    await supabase.storage.from('post-images').remove(images.map((i) => i.storage_path));
  }

  const { error } = await supabase.from('posts').delete().eq('id', postId).eq('author_id', user.id);
  if (error) return { error: '게시글 삭제에 실패했습니다.' };
  return { success: true };
}

export async function clientToggleLike(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: existing } = await supabase
    .from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single();

  if (existing) {
    await supabase.from('post_likes').delete().eq('id', existing.id);
    return { liked: false };
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    return { liked: true };
  }
}

/* ── Profile ───────────────────────────────────────────── */

export async function clientUpdateProfile(formData: {
  nickname: string;
  bio?: string;
  avatarFile?: File | null;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  let avatarUrl: string | undefined;
  if (formData.avatarFile) {
    const storagePath = generateProfileImagePath(user.id, formData.avatarFile.name);
    const { error: upErr } = await supabase.storage
      .from('profile-images').upload(storagePath, formData.avatarFile, { upsert: true });
    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(storagePath);
      avatarUrl = publicUrl;
    }
  }

  const updateData: Record<string, string | null> = {
    nickname: formData.nickname,
    bio: formData.bio ?? null,
  };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
  if (error) return { error: '프로필 수정에 실패했습니다.' };
  return { success: true };
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateStoragePath } from '@/lib/utils/format';

export async function createPost(formData: {
  title: string;
  content: string;
  category?: string;
  images: { file: File; sortOrder: number }[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: formData.title,
      content: formData.content,
      category: formData.category || null,
    })
    .select()
    .single();

  if (postError || !post) return { error: postError?.message ?? '게시글 작성에 실패했습니다.' };

  for (const { file, sortOrder } of formData.images) {
    const storagePath = generateStoragePath(user.id, post.id, file.name);
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(storagePath, file);

    if (uploadError) continue;

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(storagePath);

    await supabase.from('post_images').insert({
      post_id: post.id,
      storage_path: storagePath,
      image_url: publicUrl,
      sort_order: sortOrder,
    });
  }

  revalidatePath('/');
  redirect(`/posts/${post.id}`);
}

export async function updatePost(
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: '로그인이 필요합니다.' };

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category || null,
    })
    .eq('id', postId)
    .eq('author_id', user.id);

  if (updateError) return { error: '게시글 수정에 실패했습니다.' };

  for (const imageId of formData.deletedImageIds) {
    await supabase.from('post_images').delete().eq('id', imageId);
  }
  if (formData.deletedStoragePaths.length > 0) {
    await supabase.storage.from('post-images').remove(formData.deletedStoragePaths);
  }

  for (const { file, sortOrder } of formData.newImages) {
    const storagePath = generateStoragePath(user.id, postId, file.name);
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(storagePath, file);

    if (uploadError) continue;

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(storagePath);

    await supabase.from('post_images').insert({
      post_id: postId,
      storage_path: storagePath,
      image_url: publicUrl,
      sort_order: sortOrder,
    });
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/');
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: images } = await supabase
    .from('post_images')
    .select('storage_path')
    .eq('post_id', postId);

  if (images && images.length > 0) {
    await supabase.storage
      .from('post-images')
      .remove(images.map((img) => img.storage_path));
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id);

  if (error) return { error: '게시글 삭제에 실패했습니다.' };

  revalidatePath('/');
  redirect('/');
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: '로그인이 필요합니다.' };

  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    await supabase.from('post_likes').delete().eq('id', existing.id);
    revalidatePath(`/posts/${postId}`);
    revalidatePath('/');
    return { liked: false };
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    revalidatePath(`/posts/${postId}`);
    revalidatePath('/');
    return { liked: true };
  }
}

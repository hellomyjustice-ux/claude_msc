export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  post_images?: PostImage[];
  post_likes?: { count: number }[];
  likes_count?: number;
  user_has_liked?: boolean;
}

export interface PostImage {
  id: string;
  post_id: string;
  storage_path: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostWithDetails extends Post {
  profiles: Profile;
  post_images: PostImage[];
  likes_count: number;
  user_has_liked: boolean;
}

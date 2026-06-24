import { useEffect, useState, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import ImageCard from './image-card';
import { supabase, BUCKET_NAME } from '../../lib/supabase';

/**
 * GalleryGrid 컴포넌트 — Supabase Storage에서 이미지 목록을 가져와 그리드로 렌더링
 *
 * Props:
 * @param {number} refreshKey - 값이 바뀔 때마다 목록 새로고침 [Required]
 *
 * Example usage:
 * <GalleryGrid refreshKey={refreshKey} />
 */
function GalleryGrid({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      return;
    }

    const imageList = (data || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((file) => ({
        ...file,
        url: supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl,
      }));

    setImages(imageList);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, refreshKey]);

  const handleDelete = async (image) => {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([image.name]);
    if (!error) fetchImages();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color='secondary' />
      </Box>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <ImageIcon sx={{ fontSize: 64, opacity: 0.3, mb: 1, display: 'block', mx: 'auto' }} />
        <Typography variant='body1'>업로드된 이미지가 없습니다</Typography>
        <Typography variant='caption'>위 업로드 영역에서 이미지를 추가해보세요</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {images.map((image) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id || image.name}>
          <ImageCard image={image} onDelete={handleDelete} />
        </Grid>
      ))}
    </Grid>
  );
}

export default GalleryGrid;

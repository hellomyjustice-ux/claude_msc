import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { supabase, BUCKET_NAME } from '../../lib/supabase';

/**
 * UploadButton 컴포넌트 — 드래그앤드롭 + 클릭 업로드
 *
 * Props:
 * @param {function} onUploadComplete - 업로드 완료 후 갤러리 새로고침 콜백 [Required]
 *
 * Example usage:
 * <UploadButton onUploadComplete={() => setRefreshKey(k => k + 1)} />
 */
function UploadButton({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setSnackbar({ open: true, message: '이미지 파일만 업로드 가능합니다.', severity: 'warning' });
      return;
    }

    setUploading(true);
    setProgress(0);
    let successCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (!error) successCount++;
      else console.error('Upload error:', error);
      setProgress(((i + 1) / imageFiles.length) * 100);
    }

    setUploading(false);
    if (successCount > 0) {
      setSnackbar({ open: true, message: `${successCount}개 파일 업로드 완료!`, severity: 'success' });
      onUploadComplete();
    } else {
      setSnackbar({ open: true, message: '업로드에 실패했습니다.', severity: 'error' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <>
      <Box
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'secondary.main' : 'rgba(212,150,26,0.5)',
          borderRadius: '14px',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          bgcolor: isDragging ? 'rgba(212,150,26,0.08)' : 'rgba(74,122,150,0.3)',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'secondary.main',
            bgcolor: 'rgba(212,150,26,0.06)',
          },
        }}
      >
        <input
          ref={inputRef}
          type='file'
          hidden
          multiple
          accept='image/*'
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <CloudUploadIcon sx={{ fontSize: 44, color: 'secondary.main', mb: 1 }} />
        <Typography
          variant='body1'
          fontWeight={600}
          sx={{ color: 'var(--color-text-primary)' }}
        >
          {uploading ? '업로드 중...' : '이미지를 드래그하거나 클릭해서 업로드'}
        </Typography>
        <Typography
          variant='caption'
          sx={{ display: 'block', mt: 0.5, color: 'var(--color-text-muted)' }}
        >
          JPG · PNG · GIF · WEBP — 파일당 최대 50MB
        </Typography>
        {uploading && (
          <LinearProgress
            variant='determinate'
            value={progress}
            color='secondary'
            sx={{ mt: 2, borderRadius: 4, height: 6 }}
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant='filled' sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UploadButton;

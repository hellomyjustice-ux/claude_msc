import { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * ImageCard 컴포넌트
 *
 * Props:
 * @param {object} image - { name, url, metadata, created_at } [Required]
 * @param {function} onDelete - 삭제 클릭 콜백 [Optional]
 *
 * Example usage:
 * <ImageCard image={imageObj} onDelete={handleDelete} />
 */
function ImageCard({ image, onDelete }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
      }}
    >
      <CardMedia
        component='img'
        height='180'
        image={image.url}
        alt={image.name}
        sx={{ objectFit: 'cover', bgcolor: '#f0f4f8' }}
      />
      <CardContent sx={{ pb: 0, pt: 1.5, px: 2 }}>
        <Typography variant='body2' fontWeight={600} noWrap title={image.name}>
          {image.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
          <Typography variant='caption' color='text.secondary'>
            {formatSize(image.metadata?.size)}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {formatDate(image.created_at)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 1.5, pt: 0.5, pb: 1.5 }}>
        <Tooltip title='다운로드'>
          <span>
            <IconButton
              size='small'
              color='secondary'
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? <CircularProgress size={16} /> : <DownloadIcon fontSize='small' />}
            </IconButton>
          </span>
        </Tooltip>
        {onDelete && (
          <Tooltip title='삭제'>
            <IconButton size='small' color='error' onClick={() => onDelete(image)}>
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}

export default ImageCard;

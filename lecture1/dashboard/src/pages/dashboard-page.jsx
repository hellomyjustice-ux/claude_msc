import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Header from '../components/common/header';
import UploadButton from '../components/gallery/upload-button';
import GalleryGrid from '../components/gallery/gallery-grid';

function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Container maxWidth='xl' sx={{ flex: 1, py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant='h5' fontWeight={700} color='primary.main' gutterBottom>
            갤러리 대시보드
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            이미지를 업로드하고 관리하세요. 업로드된 파일은 새로고침 후에도 유지되며 모든 사용자가 공유합니다.
          </Typography>
        </Box>

        <UploadButton onUploadComplete={() => setRefreshKey((k) => k + 1)} />

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' fontWeight={600} color='text.primary' sx={{ mb: 2 }}>
          업로드된 이미지
        </Typography>

        <GalleryGrid refreshKey={refreshKey} />
      </Container>
    </Box>
  );
}

export default DashboardPage;

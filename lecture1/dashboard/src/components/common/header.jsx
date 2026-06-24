import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';

function Header() {
  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{ bgcolor: 'primary.main', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon sx={{ color: 'white' }} />
          <Typography variant='h6' fontWeight={700} color='white' letterSpacing={1}>
            VIBE DASH
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.6)' }}>
          이미지 갤러리
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

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
      sx={{
        bgcolor: 'primary.dark',
        borderBottom: '1px solid rgba(212,150,26,0.25)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DashboardIcon sx={{ color: 'secondary.main', fontSize: 26 }} />
          <Typography
            variant='h6'
            fontWeight={700}
            letterSpacing={2}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            VIBE DASH
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant='caption' sx={{ color: 'var(--color-text-muted)' }}>
          이미지 갤러리
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

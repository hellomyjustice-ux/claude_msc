import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5589A5',
      light: '#7AADC4',
      dark: '#4A7A96',
    },
    secondary: {
      main: '#D4961A',
      light: '#E8B040',
      dark: '#B87E14',
    },
    background: {
      default: '#5589A5',
      paper: '#F5EEE0',
    },
    text: {
      primary: '#2C4050',
      secondary: '#5A7A8A',
      disabled: '#8AABB8',
    },
    error: {
      main: '#C0392B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

export default theme;

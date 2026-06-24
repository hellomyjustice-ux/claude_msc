import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A6B',
      light: '#2E5299',
      dark: '#142A52',
    },
    secondary: {
      main: '#3D7ED8',
      light: '#6AA3E8',
      dark: '#2A65BC',
    },
    background: {
      default: '#EBF1FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
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

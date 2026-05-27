import { createTheme } from '@mui/material/styles';

export const luxuryTheme = createTheme({
  palette: {
    mode: 'light', // ✅ Changed to light
    background: {
      default: '#FDFBF7', // ✅ Creamy white canvas
      paper: '#FFFFFF',   // ✅ White paper blocks
    },
    primary: {
      main: '#4A0E17',    // ✅ Deep Maroon (Brand Color)
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B89B73',    // ✅ Luxury Gold accent
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // ✅ Dark grey for readability
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    // Baaki typography settings wahi rakho...
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, 
          padding: '12px 28px',
        },
        containedPrimary: {
          backgroundColor: '#4A0E17',
          '&:hover': { backgroundColor: '#2C050B' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid rgba(74, 14, 23, 0.1)', // Subtle border
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});
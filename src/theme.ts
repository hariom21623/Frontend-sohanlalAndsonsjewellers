import { createTheme } from '@mui/material/styles';

export const luxuryTheme = createTheme({
  palette: {
    primary: {
      main: '#4A0E17', // Deep, elegant Burgundy/Maroon instead of bright red
      light: '#722F37',
      dark: '#2C050B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4AF37', // Warm Champagne Gold accents
      light: '#F3E5AB',
      dark: '#AA7C11',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#FAFAFA', // Soft off-white to eliminate sterile bright white walls
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A', // Softer black for editorial reading comfort
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 600 },
    h2: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 500 },
    h3: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 500 },
    h4: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 500 },
    h5: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 500 },
    h6: { fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 600, letterSpacing: '0.05em' },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp crisp edges shout luxury tailoring more than rounded pills
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: '#4A0E17',
          '&:hover': {
            backgroundColor: '#2C050B',
            boxShadow: '0px 4px 20px rgba(74, 14, 23, 0.15)',
          },
        },
        outlinedSecondary: {
          borderColor: '#D4AF37',
          color: '#AA7C11',
          '&:hover': {
            borderColor: '#AA7C11',
            backgroundColor: 'rgba(212, 175, 55, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #EFEFEF',
          '&:hover': {
            boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});
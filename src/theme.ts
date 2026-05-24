import { createTheme } from '@mui/material/styles';

export const luxuryTheme = createTheme({
  palette: {
    mode: 'dark', // 🚀 Forces dark mode baseline settings
    background: {
      default: '#0A0A0A', // Mockup matte black canvas
      paper: '#141414',   // Deep charcoal floating blocks/dropdowns
    },
    primary: {
      main: '#E5D5BC',    // Premium soft luxury gold accent
      light: '#F5E6D3',
      dark: '#B89B73',
      contrastText: '#0A0A0A',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#0A0A0A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: '0.03em' },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 500, letterSpacing: '0.03em' },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: '0.05em' },
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
          borderRadius: 0, // Tailored sharp modern edges
          padding: '12px 28px',
          transition: 'all 0.3s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: '#E5D5BC',
          color: '#0A0A0A',
          '&:hover': {
            backgroundColor: '#B89B73',
            boxShadow: '0px 4px 20px rgba(229, 213, 188, 0.2)',
          },
        },
        outlinedPrimary: {
          borderColor: '#E5D5BC',
          color: '#E5D5BC',
          '&:hover': {
            borderColor: '#FFFFFF',
            backgroundColor: 'rgba(229, 213, 188, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid rgba(229, 213, 188, 0.15)',
          backgroundColor: '#141414',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 30px rgba(229, 213, 188, 0.05)',
          },
        },
      },
    },
  },
});
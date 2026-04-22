import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useAuth } from '../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AppHeader() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
       <Typography
            variant="h6"
            sx={{
              flexGrow: 5,
              // FIX 1: Make it clickable
              cursor: "pointer", 
            }}
            // FIX 2: Navigate to the admin homepage when clicked
            onClick={() => navigate("/admin")} 
          >
            Sohan Lal & Son’s Jewellers
          </Typography>

        <Stack direction="row" spacing={1}>
          {token ? (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  if (user?.adminRole) navigate('/admin');
                  else navigate('/user');
                }}
              >
                HomePage
              </Button>

              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>

              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Badge, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { ShoppingBagOutlined, FavoriteBorderOutlined, PersonOutlineOutlined, SearchOutlined, LogoutOutlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom'; // 🚀 IMPORTED useLocation to check current path
import { useAuth } from '../../../contexts/AuthProvider'; 
import TrustBar from './TrustBar'; 

interface MainNavbarProps {
  onSearch: (query: string) => void;
}

export default function MainNavbar({ onSearch }: MainNavbarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 🚀 Hook to trace active viewport address
  const [searchVal, setSearchVal] = useState("");
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    onSearch(value); 
  };

  // 🚀 🔥 INTELLIGENT LOGO CLICK FORCE SCROLL ENGINE
  const handleLogoClick = () => {
    // Check if user is already sitting on the base home coordinates paths
    if (location.pathname === "/" || location.pathname === "/user") {
      // Force instant coordinate resetting to absolute zero top position
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth" // Smooth layout glide animation effect back to top banner
      });
    } else {
      // If on any other secondary details screen, navigate home normally
      navigate('/');
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid rgba(229, 213, 188, 0.15)', 
        bgcolor: '#0A0A0A', 
        zIndex: 1100 
      }}
    >
      <TrustBar />

      <Toolbar sx={{ 
        flexDirection: 'column',
        alignItems: 'stretch',
        px: { xs: 2, md: 6 }, 
        py: { xs: 1.9, md: 1.5 } 
      }}>
        
        {/* Row 1: Brand Logo & Actions Area */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: { xs: 1.5, md: 0 } }}>
          
          {/* 🔥 FIXED BRAND IDENTITY BOX: Hooked to our advanced handleLogoClick engine */}
          <Box 
            onClick={handleLogoClick} // 🚀 Calls the dual navigation/force-scroll helper
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer', 
              userSelect: 'none',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.85 
              }
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: '"Playfair Display", serif', 
                fontWeight: 700, 
                color: '#E5D5BC', 
                letterSpacing: '0.05em',
                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              सोहन लाल एंड संस ज्वेलर्स
            </Typography>
            <Typography variant="caption" sx={{ letterSpacing: '0.32em', fontSize: '0.52rem', color: '#FFFFFF', display: 'block', mt: 0.5 }}>
              LUXE JEWELLERY SHOWROOM
            </Typography>
          </Box>

          {/* Action Triggers Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
            <IconButton sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, '&:hover': { color: '#E5D5BC' } }}>
              <Badge badgeContent={0} sx={{ '& .MuiBadge-badge': { bgcolor: '#E5D5BC', color: '#0A0A0A', fontWeight: 700 } }}>
                <FavoriteBorderOutlined />
              </Badge>
            </IconButton>
            
            <IconButton sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, '&:hover': { color: '#E5D5BC' } }}>
              <Badge badgeContent={0} sx={{ '& .MuiBadge-badge': { bgcolor: '#E5D5BC', color: '#0A0A0A', fontWeight: 700 } }}>
                <ShoppingBagOutlined />
              </Badge>
            </IconButton>

            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, ml: 0.5, '&:hover': { color: '#E5D5BC' } }}
            >
              <PersonOutlineOutlined />
            </IconButton>
          </Box>
        </Box>

        {/* Row 2: Deep Dark Embedded Search Bar Box */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: '#141414', 
          px: 2, 
          py: 0.4, 
          width: { xs: '100%', md: '32%' },
          mx: 'auto',
          border: '1px solid rgba(229, 213, 188, 0.3)', 
          '&:focus-within': { borderColor: '#E5D5BC' },
          position: { md: 'absolute' },
          left: { md: '50%' },
          transform: { md: 'translateX(-50%)' },
          zIndex: 5
        }}>
          <InputBase 
            placeholder="Search collections..." 
            value={searchVal} 
            onChange={handleChange} 
            sx={{ ml: 1, flex: 1, fontSize: '0.85rem', color: '#FFFFFF', '& input::placeholder': { color: '#B3B3B3', opacity: 1 } }} 
          />
          <SearchOutlined sx={{ color: '#E5D5BC', fontSize: '1.2rem' }} />
        </Box>
      </Toolbar>

      {/* Profile Menu Overlay */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: '#141414',
            border: '1px solid rgba(229, 213, 188, 0.25)',
            borderRadius: 0, 
            mt: 1,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              py: 1.4,
              '&:hover': {
                bgcolor: 'rgba(229, 213, 188, 0.08)',
                color: '#E5D5BC'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(229, 213, 188, 0.15)', mb: 0.5 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#B3B3B3', fontSize: '0.7rem', letterSpacing: '0.05em' }}>LOGGED IN AS</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#E5D5BC', mt: 0.2 }}>{user.name || 'Customer'}</Typography>
          </Box>
        )}
        <MenuItem onClick={() => { setAnchorEl(null); logout("/login"); }}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" sx={{ color: '#E5D5BC' }} />
          </ListItemIcon>
          LOGOUT
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
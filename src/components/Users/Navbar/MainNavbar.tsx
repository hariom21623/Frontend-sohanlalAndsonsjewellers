import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Badge, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { ShoppingBagOutlined, FavoriteBorderOutlined, PersonOutlineOutlined, SearchOutlined, LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthProvider'; 

interface MainNavbarProps {
  onSearch: (query: string) => void;
}

export default function MainNavbar({ onSearch }: MainNavbarProps) {
  const { logout, user } = useAuth();
  const [searchVal, setSearchVal] = useState("");
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    onSearch(value); 
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #E5D5BC', bgcolor: '#FDFBF7', zIndex: 1100 }}>
      {/* Top Banner Accent */}

      {/* Main Container Toolbar */}
      <Toolbar sx={{ 
        flexDirection: 'column',
        alignItems: 'stretch',
        px: { xs: 2, md: 6 }, 
        py: { xs: 1.5, md: 1 } 
      }}>
        
        {/* Row 1: Brand Logo & Actions Area */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: { xs: 1.5, md: 0 } }}>
          
          {/* Scalable Luxury Typography */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: '"Playfair Display", serif', 
              fontWeight: 700, 
              color: '#4A0E17',
              letterSpacing: '0.02em',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.7rem' },
              whiteSpace: 'nowrap'
            }}
          >
            सोहन लाल एंड संस ज्वेलर्स
          </Typography>

          {/* Action Row Controls (Reordered to put Profile/Person at the very last position 🔥) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
            {/* 1. Wishlist Icon */}
            <IconButton sx={{ color: '#4A0E17', p: { xs: 0.5, sm: 1 } }}>
              <Badge badgeContent={0} color="primary"><FavoriteBorderOutlined /></Badge>
            </IconButton>
            
            {/* 2. Shopping Bag Icon */}
            <IconButton sx={{ color: '#4A0E17', p: { xs: 0.5, sm: 1 } }}>
              <Badge badgeContent={0} color="primary"><ShoppingBagOutlined /></Badge>
            </IconButton>

            {/* 3. Profile Person Action (Moved to last position) */}
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: '#4A0E17', p: { xs: 0.5, sm: 1 }, ml: 0.5 }}
            >
              <PersonOutlineOutlined />
            </IconButton>
          </Box>
        </Box>

        {/* Row 2: Search Input Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: '#F9F6F0', 
          px: 2, 
          py: 0.5, 
          width: { xs: '100%', md: '35%' },
          mx: 'auto',
          border: '1px solid #E5D5BC', 
          '&:focus-within': { borderColor: '#4A0E17' },
          position: { md: 'absolute' },
          left: { md: '50%' },
          transform: { md: 'translateX(-50%)' },
          zIndex: 5
        }}>
          <InputBase 
            placeholder="Search collections..." 
            value={searchVal} 
            onChange={handleChange} 
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} 
          />
          <SearchOutlined sx={{ color: '#4A0E17', fontSize: '1.2rem' }} />
        </Box>
      </Toolbar>

      {/* Luxury Dropdown Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: '#FDFBF7',
            border: '1px solid #E5D5BC',
            borderRadius: 0, 
            mt: 1,
            minWidth: 160,
            '& .MuiMenuItem-root': {
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              color: '#1A1A1A',
              py: 1.2,
              '&:hover': {
                bgcolor: 'rgba(74, 14, 23, 0.04)',
                color: '#4A0E17'
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #E5D5BC', mb: 0.5 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#6E6557' }}>Logged in as</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A0E17' }}>{user.name || 'Customer'}</Typography>
          </Box>
        )}
        <MenuItem onClick={() => { setAnchorEl(null); logout("/login"); }}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" sx={{ color: '#4A0E17' }} />
          </ListItemIcon>
          LOGOUT
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
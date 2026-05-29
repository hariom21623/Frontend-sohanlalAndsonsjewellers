import React, { useState, useEffect, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Badge, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { ShoppingBagOutlined, FavoriteBorderOutlined, PersonOutlineOutlined, SearchOutlined, LogoutOutlined, Notifications } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider';
import { useCart } from '../../../contexts/CartProvider';
import CartDrawer from '../Cart/CartDrawer';
import TrustBar from './TrustBar';

interface MainNavbarProps {
  onSearch: (query: string) => void;
}

export default function MainNavbar({ onSearch }: MainNavbarProps) {
  const { logout, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVal, setSearchVal] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🚀 LIVE WISHLIST BADGE STATE
  const [wishlistCount, setWishlistCount] = useState(() => {
    // ANTI-BLINK INITIALIZER: Page load hote hi instant storage read bina delay ke
    try {
      const saved = localStorage.getItem("sls_wishlist");
      const ids = saved ? JSON.parse(saved) : [];
      return Array.isArray(ids) ? ids.length : 0;
    } catch {
      return 0;
    }
  });

  // 🚀 SMOOTH UPDATE ENGINE: Instantly reacts to custom updates without destroying state trees
  useEffect(() => {
    const updateCount = () => {
      try {
        const savedWishlistRaw = localStorage.getItem("sls_wishlist");
        const wishlistIds = savedWishlistRaw ? JSON.parse(savedWishlistRaw) : [];
        const newCount = Array.isArray(wishlistIds) ? wishlistIds.length : 0;

        // Prevent setting same state to stop re-render loops & blinking
        setWishlistCount((prev) => (prev === newCount ? prev : newCount));
      } catch {
        setWishlistCount(0);
      }
    };

    window.addEventListener("sls_wishlist_update", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("sls_wishlist_update", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []); // 🚀 REMOVED location triggers to prevent navbar numbers from flashing on routing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    onSearch(value);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/" || location.pathname === "/user") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      navigate('/');
    }
  };

  // Memoize counts to make DOM node injection sub-millisecond fast
  const memoizedWishlistCount = useMemo(() => wishlistCount, [wishlistCount]);
  const memoizedItemCount = useMemo(() => itemCount, [itemCount]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(229, 213, 188, 0.15)', bgcolor: '#0A0A0A', zIndex: 1100 }}
      >
        <TrustBar />

        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', px: { xs: 2, md: 6 }, py: { xs: 1.9, md: 1.5 } }}>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: { xs: 1.5, md: 0 } }}>
            {/* Logo box */}
            <Box onClick={handleLogoClick} sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', userSelect: 'none', '&:hover': { opacity: 0.85 } }}>
              <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#E5D5BC', letterSpacing: '0.05em', fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' }, whiteSpace: 'nowrap', lineHeight: 1 }}>
                सोहन लाल एंड संस ज्वेलर्स
              </Typography>
              <Typography variant="caption" sx={{ letterSpacing: '0.32em', fontSize: '0.52rem', color: '#FFFFFF', display: 'block', mt: 0.5 }}>
                LUXE JEWELLERY SHOWROOM
              </Typography>
            </Box>

            {/* Actions area */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>

              {/* 🚀 FIXED ZERO-BLINK WISHLIST ICON & COUNTER */}
              <IconButton onClick={() => navigate("/wishlist")} sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, '&:hover': { color: '#E5D5BC' } }}>
                <Badge
                  badgeContent={memoizedWishlistCount}
                  showZero={false} // Smoothly hides instead of flashing a 0 text node layout change
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#E5D5BC',
                      color: '#0A0A0A',
                      fontWeight: 700,
                      transition: 'none' // Disables native slow CSS transitions that cause layout text jumps
                    }
                  }}
                >
                  <FavoriteBorderOutlined />
                </Badge>
              </IconButton>

              {/* Bag Shopping Icon */}
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, '&:hover': { color: '#E5D5BC' } }}>
                <Badge
                  badgeContent={memoizedItemCount}
                  showZero={false}
                  sx={{ '& .MuiBadge-badge': { bgcolor: '#E5D5BC', color: '#0A0A0A', fontWeight: 700, transition: 'none' } }}
                >
                  <ShoppingBagOutlined />
                </Badge>
              </IconButton>

              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: '#FFFFFF', p: { xs: 0.5, sm: 1 }, ml: 0.5, '&:hover': { color: '#E5D5BC' } }}>
                <PersonOutlineOutlined />
              </IconButton>
            </Box>
          </Box>

          {/* Search container */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#141414', px: 2, py: 0.4, width: { xs: '100%', md: '32%' }, mx: 'auto', border: '1px solid rgba(229, 213, 188, 0.3)', '&:focus-within': { borderColor: '#E5D5BC' }, position: { md: 'absolute' }, left: { md: '50%' }, transform: { md: 'translateX(-50%)' }, zIndex: 5 }}>
            <InputBase placeholder="Search collections..." value={searchVal} onChange={handleChange} sx={{ ml: 1, flex: 1, fontSize: '0.85rem', color: '#FFFFFF' }} />
            <SearchOutlined sx={{ color: '#E5D5BC', fontSize: '1.2rem' }} />
          </Box>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              minWidth: 200,
              mt: 1.5,
              '& .MuiMenuItem-root': { py: 1.5, fontSize: '0.9rem' }
            }
          }}
        >
          {user ? (
            <>
              {/* Profile Header */}
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee', mb: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>

              <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile"); }}>
                <ListItemIcon><PersonOutlineOutlined fontSize="small" /></ListItemIcon>
                My Profile
              </MenuItem>

              <MenuItem onClick={() => { setAnchorEl(null); navigate("/my-orders"); }}>
                <ListItemIcon><ShoppingBagOutlined fontSize="small" /></ListItemIcon>
                Orders
              </MenuItem>

              <MenuItem onClick={() => { setAnchorEl(null); navigate("/notifications"); }}>
                <ListItemIcon><Notifications fontSize="small" /></ListItemIcon>
                Notifications
              </MenuItem>

              <MenuItem onClick={() => { setAnchorEl(null); logout("/"); }}>
                <ListItemIcon><LogoutOutlined fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/login"); }}>
              <ListItemIcon><PersonOutlineOutlined fontSize="small" /></ListItemIcon>
              Login
            </MenuItem>
          )}
        </Menu>
      </AppBar>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
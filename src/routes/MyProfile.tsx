import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Grid as Grid, TextField, Button, IconButton } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material'; // ✅ Back icon
import { useNavigate } from 'react-router-dom'; // ✅ Navigation
import { getMyProfile, updateUser } from '../api/adminUser'; 
import { toast } from 'react-toastify';

export default function MyProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        getMyProfile().then((res) => {
            setProfile(res.user);
            setFormData(res.user);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        try {
            await updateUser(profile.id, formData);
            setProfile(formData);
            setIsEditing(false);
            toast.success("Profile updated successfully!"); 
        } catch (err) {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 8 }, minHeight: '80vh', bgcolor: '#FDFBF7' }}>
            {/* ✅ BACK BUTTON & HEADER */}
            <Box sx={{ mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIos />} 
                    onClick={() => navigate('/')} 
                    sx={{ color: '#8E8370', mb: 2, fontSize: '0.8rem' }}
                >
                    BACK TO HOME
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: '#4A0E17', fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
                        My Account
                    </Typography>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} sx={{ color: '#4A0E17', fontWeight: 600 }}>Edit</Button>
                    ) : (
                        <Box>
                            <Button onClick={() => setIsEditing(false)} sx={{ color: '#8E8370', mr: 1 }}>Cancel</Button>
                            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A0E17' }}>Save</Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: '#4A0E17' }} /></Box>
            ) : (
                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 0, border: '1px solid #E5D5BC', bgcolor: '#FFFFFF', boxShadow: 'none' }}>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: '#4A0E17', letterSpacing: '0.05em' }}>
                        PERSONAL INFORMATION
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isEditing ? (
                                <TextField fullWidth label="Full Name" variant="standard" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} sx={{ mb: 3 }} />
                            ) : (
                                <Box sx={{ mb: 3 }}><Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700 }}>FULL NAME</Typography><Typography variant="body1">{profile?.name}</Typography></Box>
                            )}
                            {isEditing ? (
                                <TextField fullWidth label="Email" variant="standard" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} sx={{ mb: 3 }} />
                            ) : (
                                <Box sx={{ mb: 3 }}><Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700 }}>EMAIL ADDRESS</Typography><Typography variant="body1">{profile?.email}</Typography></Box>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            {isEditing ? (
                                <TextField fullWidth label="Mobile Number" variant="standard" value={formData.phoneNumber || ''} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} sx={{ mb: 3 }} />
                            ) : (
                                <Box sx={{ mb: 3 }}><Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700 }}>MOBILE NUMBER</Typography><Typography variant="body1">{profile?.phoneNumber}</Typography></Box>
                            )}
                            {isEditing ? (
                                <TextField fullWidth label="Pincode" variant="standard" value={formData.pincode || ''} onChange={(e) => setFormData({...formData, pincode: e.target.value})} sx={{ mb: 3 }} />
                            ) : (
                                <Box sx={{ mb: 3 }}><Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700 }}>PINCODE</Typography><Typography variant="body1">{profile?.pincode || "Not provided"}</Typography></Box>
                            )}
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        {isEditing ? (
                            <TextField fullWidth label="Shipping Address" variant="standard" multiline rows={2} value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        ) : (
                            <Box><Typography variant="caption" sx={{ color: '#8E8370', fontWeight: 700 }}>SHIPPING ADDRESS</Typography><Typography variant="body1">{profile?.address || "No address saved yet."}</Typography></Box>
                        )}
                    </Box>
                </Paper>
            )}
        </Container>
    );
}
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, Typography, TextField, Button, Card, Divider, CircularProgress } from "@mui/material";
// import Grid from "@mui/material/Grid2"; // 🚀 MUI Modern Grid v5 architecture layout
import { useCart } from "../../../contexts/CartProvider"; // Aapki file location sync hook
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../../components/Users/Navbar/MainNavbar";
import UserFooter from "../../../components/Users/Footer/MainFooter";

export default function CheckoutPage() {
  // 🚀 FIXED: Extracted 'clear' instead of clearCart according to your real file context keys!
  const { items, total, clear } = useCart();
  const { user } = useAuth() as any; 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  
  // Syncing layout states with Prisma backend keys exactly
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phoneNumber || "", // 🚀 FIXED: database parameter matching 'phoneNumber'
    address: user?.address || "",    
    pincode: user?.pincode || "",
    alternatePhone: user?.alternatePhone || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phoneNumber || "", 
        address: user.address || "",
        pincode: user.pincode || "",
        alternatePhone: user.alternatePhone || ""
      });
    }
  }, [user]);

  if (!items.length && !loading) {
    return (
      <Box sx={{ bgcolor: "#FDFBF7", minHeight: "100vh" }}>
        <MainNavbar onSearch={() => {}} />
        <Container sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 3 }}>
            Your Shopping Bag is Empty
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#4A0E17", borderRadius: 0, px: 4, py: 1.2 }}>
            Continue Shopping
          </Button>
        </Container>
        <UserFooter />
      </Box>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill all required shipping layouts!");
      return;
    }

    setLoading(true);
    try {
      // 🚀 FUTURE BACKEND INTEGRATION NODE:
      // Jab backend server controllers ready ho, use uncomment karke push kar sakte hain:
      // await axios.post('/api/orders/create', { items, userDetails: formData, total });

      const showroomWhatsAppNumber = "91XXXXXXXXXX"; // 🔥 TYPE YOUR WHATSAPP SHOWROOM NUMBER HERE (with 91 prefix)
      const orderId = `SLS-${Date.now().toString().slice(-6)}`;
      
      let messageTemplate = `👑 *NEW ORDER - SOHAN LAL & SONS JEWELLERS*\n\n`;
      messageTemplate += `*Order ID:* #${orderId}\n\n`;
      messageTemplate += `👤 *Customer Details:*\n`;
      messageTemplate += `• *Name:* ${formData.name}\n`;
      messageTemplate += `• *Phone:* ${formData.phone}\n`;
      messageTemplate += `• *Address:* ${formData.address}, Pincode: ${formData.pincode}\n`;
      if (formData.alternatePhone) messageTemplate += `• *Alt Phone:* ${formData.alternatePhone}\n`;
      messageTemplate += `\n🛒 *Order Items:*\n`;

      items.forEach((it, idx) => {
        messageTemplate += `${idx + 1}. *${it.name}* (SKU: ${it.sku || "N/A"}) - ${it.qty} Pcs | ₹${it.price.toLocaleString("en-IN")}\n`;
      });

      messageTemplate += `\n💰 *Total Value Amount:* ₹${total.toLocaleString("en-IN")}\n`;
      messageTemplate += `\n_(Please check and coordinate further for payment option confirmations.)_`;

      const encodedWhatsAppURI = encodeURIComponent(messageTemplate);
      const targetWhatsAppURL = `https://wa.me/${showroomWhatsAppNumber}?text=${encodedWhatsAppURI}`;

      clear(); // 🚀 FIXED: Calls your context 'clear()' method safely now!

      window.open(targetWhatsAppURL, "_blank");
      navigate("/");

    } catch (err) {
      console.error("Order workflow execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#FDFBF7", minHeight: "100vh" }}>
      <MainNavbar onSearch={() => {}} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', color: "#4A0E17", fontWeight: 600, mb: 4 }}>
          Secure Checkout
        </Typography>

        <Grid container spacing={4}>
          {/* Left Input Data Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box component="form" onSubmit={handlePlaceOrder} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', color: "#4A0E17" }}>
                Verify Delivery Address
              </Typography>
              
              <TextField label="Full Name *" name="name" value={formData.name} onChange={handleInputChange} fullWidth required variant="outlined" />
              <TextField label="WhatsApp Phone Number *" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth required />
              <TextField label="Full Delivery Address *" name="address" value={formData.address} onChange={handleInputChange} fullWidth required multiline rows={3} />
              <TextField label="Area Pincode *" name="pincode" value={formData.pincode} onChange={handleInputChange} fullWidth required />
              <TextField label="Alternate Contact Number (Optional)" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} fullWidth />

              <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ bgcolor: "#4A0E17", color: "#FFF", borderRadius: 0, py: 1.8, fontWeight: 600, letterSpacing: "0.08em", "&:hover": { bgcolor: "#2C050B" } }}>
                {loading ? <CircularProgress size={24} sx={{ color: "#FFF" }} /> : "CONFIRM ORDER ON WHATSAPP"}
              </Button>
            </Box>
          </Grid>

          {/* Right Summary Invoice Column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 0, boxShadow: "none", border: "1px solid rgba(229, 213, 188, 0.3)", p: 3, bgcolor: "#FFF" }}>
              <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', color: "#4A0E17", mb: 2 }}>
                Bag Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {items.map((it) => (
                <Box key={it.productId} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>{it.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#A0A0A0" }}>SKU: {it.sku || "N/A"} | Qty: {it.qty}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{(it.price * it.qty).toLocaleString("en-IN")}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#6E6557" }}>Total Payable Amount:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#4A0E17" }}>₹{total.toLocaleString("en-IN")}</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <UserFooter />
    </Box>
  );
}
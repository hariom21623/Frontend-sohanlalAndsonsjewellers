const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Build folder serve karo
app.use(express.static(path.join(__dirname, 'build')));

// Yahan (.*) use karne se ye error nahi aayega
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
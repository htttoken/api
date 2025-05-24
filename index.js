const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ---- 1. Status ----
app.get('/v1/status', (req, res) => {
  res.json({ status: '✅ HTT API is live', timestamp: new Date().toISOString() });
});

// ---- 2. Wallet Balance ----
app.get('/v1/wallet/balance/:address', (req, res) => {
  const { address } = req.params;
  // Dummy response for now
  res.json({
    address,
    balance: '123.45',
    symbol: 'HTT',
    network: 'Ethereum Mainnet'
  });
});

// ---- 3. Rewards Claim ----
app.post('/v1/rewards/claim', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  // Simulate claiming
  res.json({
    userId,
    message: 'Reward claimed successfully',
    rewardAmount: '10 HTT'
  });
});

// ---- 4. User Profile ----
app.get('/v1/user/profile', (req, res) => {
  // Normally we'd use auth middleware
  res.json({
    userId: 'user123',
    email: 'user@example.com',
    role: 'Traveler',
    level: 2
  });
});

// ---- 5. Vendor Bookings ----
app.get('/v1/bookings/:vendorId', (req, res) => {
  const { vendorId } = req.params;

  // Dummy data
  res.json({
    vendorId,
    bookings: [
      {
        bookingId: 'b001',
        guestName: 'John Doe',
        room: 'Deluxe Suite',
        status: 'Paid',
        checkIn: '2025-05-22',
        checkOut: '2025-05-25'
      }
    ]
  });
});

const { ethers } = require('ethers');

// ---- 6. MetaMask Login ----
app.post('/v1/login', async (req, res) => {
  const { address, signature, message } = req.body;

  if (!address || !signature || !message) {
    return res.status(400).json({ error: 'Missing address, signature, or message' });
  }

  try {
    const recovered = ethers.utils.verifyMessage(message, signature);

    if (recovered.toLowerCase() === address.toLowerCase()) {
      return res.json({
        success: true,
        address: recovered,
        message: '✅ Wallet verified successfully'
      });
    } else {
      return res.status(401).json({ error: 'Signature verification failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Signature verification error', details: err.message });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---- Run server ----
app.listen(PORT, () => {
  console.log(`HTT API Server is running on port ${PORT}`);
});

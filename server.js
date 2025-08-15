const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const billRoutes = require('./routes/billRoutes');

dotenv.config();
const app = express();

// ✅ CORS config for both local + production
const allowedOrigins = [
  'https://ads-group-frontend.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/bills', billRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Ads Group API');
});

// MongoDB connection (Vercel serverless-friendly)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// ✅ Export for Vercel
module.exports = app;

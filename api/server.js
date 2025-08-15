const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const billRoutes = require('./routes/billRoutes');

dotenv.config();
const app = express();

// CORS config
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
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/bills', billRoutes);
app.get('/', (req, res) => res.send('Welcome to the Ads Group API'));

// Persistent MongoDB connection for Vercel
let isConnected;
async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing in env');
  
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = db.connections[0].readyState;
  console.log('MongoDB connected');
}
connectDB().catch(err => console.error(err));

// Export for Vercel
module.exports = app;

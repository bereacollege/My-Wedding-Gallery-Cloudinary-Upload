require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const CORS = require('cors');
const cloudinary = require('cloudinary').v2;

// ➕ ADD THIS — require your new routes
const imageRoutes = require('./routes/images.cjs'); // ➕

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(CORS({
  origin: ['http://localhost:5177', 'http://localhost:3000', 'http://127.0.0.1:5177', 'https://my-wedding-gallery-cloudinary-uploa.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  optionsSuccessStatus: 204 
}));

app.use(express.json());

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is missing');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log('Database connection state:', mongoose.connection.readyState);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ➕ ADD THIS — use the routes
console.log('imageRoutes is:', imageRoutes);
app.use('/api', imageRoutes);
console.log('Mounted /api routes:', imageRoutes.stack?.map(r => r.route?.path));
 // ➕

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

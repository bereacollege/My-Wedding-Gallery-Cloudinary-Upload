require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const CORS = require('cors');
const cloudinary = require('cloudinary').v2;
const Image = require('./models/image.cjs');
const app = express();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Enable CORS for local dev (allow Vite origin)
app.use(CORS({
  origin: ['http://localhost:5177', 'http://localhost:3000', 'http://127.0.0.1:5177'],  // Add your Vite port
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
    console.log('Successfully connected to MongoDB Atlas');
    console.log('Database connection state:', mongoose.connection.readyState);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Full error details:', JSON.stringify(err, null, 2));
});

// Middleware
app.use(express.json());

// Middleware to set CORS headers;

// Test endpoint to verify MongoDB connection
app.get('/api/test-connection', async (req, res) => {
    console.log('Test connection endpoint hit');
    try {
        console.log('MongoDB connection state:', mongoose.connection.readyState);
        const count = await Image.countDocuments();
        console.log('Successfully counted documents:', count);
        res.json({ 
            status: 'success', 
            message: 'MongoDB connection is working!',
            imagesCount: count,
            connectionState: mongoose.connection.readyState
        });
    } catch (error) {
        console.error('Test connection error:', error);
        console.error('Full error stack:', error.stack);
        res.status(500).json({ 
            status: 'error', 
            message: 'MongoDB connection failed', 
            error: error.message,
            connectionState: mongoose.connection.readyState
        });
    }
});

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Get all images from the database
app.get('/api/get-gallery-images', async (req, res) => {
    console.log('Received request for gallery images');
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        console.log(`Found ${images.length} images`);
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Save image information to database
app.post('/api/save-image', async (req, res) => {
    try {
        console.log('Received save-image request:', req.body);
        const { url, cloudinaryId, contributor, filename } = req.body;
        
        if (!url || !cloudinaryId || !contributor || !filename) {
            console.error('Missing required fields:', { url, cloudinaryId, contributor, filename });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newImage = new Image({
            url,
            cloudinaryId,
            contributor,
            filename
        });

        const savedImage = await newImage.save();
        console.log('Image saved successfully:', savedImage);
        res.status(201).json(savedImage);
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: 'Failed to save image', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// test MongoDB connection by inserting a document
 

// Define a quick test schema & model 
const testSchema = new mongoose.Schema({ 
    name: String, 
    createdAt: { type: Date, default: Date.now }
 }); 
 const Test = mongoose.model('Test', testSchema);
  // Insert a document 
  async function runTest() { 
    const doc = new Test({ name: 'Wedding Test' });
    await doc.save(); 
    
    console.log('✅ Document saved:', doc); 
    
    const docs = await Test.find(); 
    console.log('📂 All documents:', docs); 
} 

runTest() 
    .then(() => mongoose.connection.close()) 
    .catch(err => console.error(err));

//end of test file

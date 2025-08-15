const express = require('express');
const router = express.Router();
const Image = require('../models/image.cjs');

// Test MongoDB connection
router.get('/test-connection', async (req, res) => {
    try {
        const count = await Image.countDocuments();
        res.json({ 
            status: 'success', 
            message: 'MongoDB connection is working!',
            imagesCount: count
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'MongoDB connection failed', 
            error: error.message
        });
    }
});

// Get all images
router.get('/get-gallery-images', async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Save image
router.post('/save-image', async (req, res) => {
    try {
        const { url, cloudinaryId, contributor, filename } = req.body;
        
        if (!url || !cloudinaryId || !contributor || !filename) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newImage = new Image({
            url,
            cloudinaryId,
            contributor,
            filename
        });

        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save image', details: error.message });
    }
});

module.exports = router;

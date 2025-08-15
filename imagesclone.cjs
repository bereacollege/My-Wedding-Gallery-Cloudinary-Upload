const express = require('express');
const router = express.Router();
const Image = require('./api/models/image.cjs');
const cloudinary = require('cloudinary').v2;

// Upload endpoint
router.post('/upload', async (req, res) => {
  try {
    const fileStr = req.body.data; // base64 image string
    const contributor = req.body.contributor || 'Guest';

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'wedding-gallery'
    });

    const image = new Image({
      url: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id,
      contributor,
      filename: uploadResponse.original_filename
    });

    await image.save();
    res.json({ success: true, image });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Fetch all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Error fetching images' });
  }
});

module.exports = router;

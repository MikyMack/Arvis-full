const RealEstate = require('../models/RealEstate');
const cloudinary = require('cloudinary').v2;

// CREATE
exports.createRealEstate = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      price,
      area,
      highlights
    } = req.body;

    // Parse highlights
    let parsedHighlights = [];
    if (typeof highlights === 'string') {
      try {
        parsedHighlights = JSON.parse(highlights);
        if (!Array.isArray(parsedHighlights)) parsedHighlights = [];
      } catch (e) {
        parsedHighlights = [];
      }
    } else if (Array.isArray(highlights)) {
      parsedHighlights = highlights;
    } else {
      parsedHighlights = [];
    }

    const imageData = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
      seoAlt: `${title} - ${location}`
    })) || [];

    const realEstate = await RealEstate.create({
      title,
      description,
      category,
      location,
      price,
      area,
      highlights: parsedHighlights,
      images: imageData
    });

    res.status(201).json(realEstate);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Failed to create real estate entry' });
  }
};

// UPDATE
exports.updateRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      location,
      price,
      area,
      highlights
    } = req.body;

    // Parse highlights
    let parsedHighlights = [];
    if (typeof highlights === 'string') {
      try {
        parsedHighlights = JSON.parse(highlights);
        if (!Array.isArray(parsedHighlights)) parsedHighlights = [];
      } catch (e) {
        parsedHighlights = [];
      }
    } else if (Array.isArray(highlights)) {
      parsedHighlights = highlights;
    } else {
      parsedHighlights = [];
    }

    const realEstate = await RealEstate.findById(id);
    if (!realEstate) return res.status(404).json({ message: 'Not found' });

    // Delete old images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      for (let img of realEstate.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    const newImages = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
      seoAlt: `${title} - ${location}`
    })) || realEstate.images;

    realEstate.title = title;
    realEstate.description = description;
    realEstate.category = category;
    realEstate.location = location;
    realEstate.price = price;
    realEstate.area = area;
    realEstate.highlights = parsedHighlights;
    realEstate.images = newImages;

    await realEstate.save();
    res.json(realEstate);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update real estate entry' });
  }
};

exports.getSingleRealEstate = async (req, res) => {
  try {
    const realEstate = await RealEstate.findById(req.params.id);
    if (!realEstate) {
      return res.status(404).json({ error: 'Architecture not found' });
    }
    res.json(realEstate);
  } catch (err) {
    console.error('Error fetching architecture:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE
exports.deleteRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const realEstate = await RealEstate.findById(id);
    if (!realEstate) return res.status(404).json({ message: 'Not found' });

    for (let img of realEstate.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await RealEstate.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete real estate entry' });
  }
};

// TOGGLE ACTIVE
exports.toggleRealEstate = async (req, res) => {
  try {
    const { id } = req.params;
    const realEstate = await RealEstate.findById(id);
    if (!realEstate) return res.status(404).json({ message: 'Not found' });

    realEstate.isActive = !realEstate.isActive;
    await realEstate.save();
    res.json({ success: true, isActive: realEstate.isActive });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle active status' });
  }
};
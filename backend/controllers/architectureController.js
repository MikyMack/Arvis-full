const Architecture = require('../models/Architecture');
const cloudinary = require('cloudinary').v2;

// CREATE
exports.createArchitecture = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      budgets,
      highlights,
      location
    } = req.body;
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
      seoAlt: `${title} - ${category}` 
    })) || [];

    const architecture = await Architecture.create({
      category,
      title,
      description,
      budgets,
      location,
      highlights: parsedHighlights,
      images: imageData
    });

    res.status(201).json(architecture);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Failed to create architecture' });
  }
};

// UPDATE
exports.updateArchitecture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category,
      title,
      description,
      budgets,
      highlights,
      location
    } = req.body;

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

    const architecture = await Architecture.findById(id);
    if (!architecture) return res.status(404).json({ message: 'Not found' });

    let updatedImages = architecture.images || [];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        seoAlt: `${title} - ${category}`
      }));
      updatedImages = updatedImages.concat(newImages);
    }

    architecture.category = category;
    architecture.title = title;
    architecture.description = description;
    architecture.budgets = budgets;
    architecture.location = location;
    architecture.highlights = parsedHighlights;
    architecture.images = updatedImages;

    await architecture.save();
    res.json(architecture);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update architecture' });
  }
};
exports.getSingleArchitecture = async (req, res) => {
  try {
    const architecture = await Architecture.findById(req.params.id);
    if (!architecture) {
      return res.status(404).json({ error: 'Architecture not found' });
    }
    res.json(architecture);
  } catch (err) {
    console.error('Error fetching architecture:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// DELETE
exports.deleteArchitecture = async (req, res) => {
  try {
    const { id } = req.params;
    const architecture = await Architecture.findById(id);
    if (!architecture) return res.status(404).json({ message: 'Not found' });

    for (let img of architecture.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Architecture.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete architecture' });
  }
};

// TOGGLE ACTIVE
exports.toggleArchitecture = async (req, res) => {
  try {
    const { id } = req.params;
    const architecture = await Architecture.findById(id);
    if (!architecture) return res.status(404).json({ message: 'Not found' });

    architecture.isActive = !architecture.isActive;
    await architecture.save();
    res.json({ success: true, isActive: architecture.isActive });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle active status' });
  }
};
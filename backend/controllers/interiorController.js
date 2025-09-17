const Interior = require('../models/Interior');
const cloudinary = require('cloudinary').v2;

// CREATE
exports.createInterior = async (req, res) => {
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

    // Fix [object Object] issue for budgets
    let parsedBudgets = budgets;
    if (typeof budgets === 'string') {
      try {
        parsedBudgets = JSON.parse(budgets);
      } catch (e) {
        parsedBudgets = budgets;
      }
    }

    const imageData = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
      seoAlt: `${String(title)} - ${String(category)}`
    })) || [];

    const interior = await Interior.create({
      category: typeof category === 'object' ? String(category) : category,
      title: typeof title === 'object' ? String(title) : title,
      description: typeof description === 'object' ? String(description) : description,
      budgets: parsedBudgets,
      location: typeof location === 'object' ? String(location) : location,
      highlights: parsedHighlights,
      images: imageData
    });

    res.status(201).json(interior);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Failed to create architecture' });
  }
};

// UPDATE
exports.updateInterior = async (req, res) => {
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

    // Fix [object Object] issue for budgets
    let parsedBudgets = budgets;
    if (typeof budgets === 'string') {
      try {
        parsedBudgets = JSON.parse(budgets);
      } catch (e) {
        parsedBudgets = budgets;
      }
    }

    const interior = await Interior.findById(id);
    if (!interior) return res.status(404).json({ message: 'Not found' });

    let updatedImages = interior.images || [];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
        seoAlt: `${String(title)} - ${String(category)}`
      }));
      updatedImages = updatedImages.concat(newImages);
    }

    interior.category = typeof category === 'object' ? String(category) : category;
    interior.title = typeof title === 'object' ? String(title) : title;
    interior.description = typeof description === 'object' ? String(description) : description;
    interior.budgets = parsedBudgets;
    interior.location = typeof location === 'object' ? String(location) : location;
    interior.highlights = parsedHighlights;
    interior.images = updatedImages;

    await interior.save();
    res.json(interior);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update architecture' });
  }
};
exports.getSingleInterior = async (req, res) => {
  try {
    const interior = await Interior.findById(req.params.id);
    if (!interior) {
      return res.status(404).json({ error: 'interior not found' });
    }
    res.json(interior);
  } catch (err) {
    console.error('Error fetching interior:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// DELETE
exports.deleteInterior = async (req, res) => {
  try {
    const { id } = req.params;
    const interior = await Interior.findById(id);
    if (!interior) return res.status(404).json({ message: 'Not found' });

    for (let img of interior.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Interior.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete interior' });
  }
};

// TOGGLE ACTIVE
exports.toggleInterior = async (req, res) => {
  try {
    const { id } = req.params;
    const interior = await Interior.findById(id);
    if (!interior) return res.status(404).json({ message: 'Not found' });

    interior.isActive = !interior.isActive;
    await interior.save();
    res.json({ success: true, isActive: interior.isActive });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ message: 'Failed to toggle active status' });
  }
};
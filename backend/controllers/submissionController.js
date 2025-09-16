const Submission = require('../models/Submission');

// Create a new submission
exports.createSubmission = async (req, res) => {
  try {
    const { name, email, phone, calculationType, calculationData, totalCost } = req.body;
    
    const submission = new Submission({
      name,
      email,
      phone,
      calculationType,
      calculationData,
      totalCost
    });
    
    await submission.save();
    
    res.status(201).json({
      success: true,
      message: 'Submission saved successfully',
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get submission by ID
exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete submission
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
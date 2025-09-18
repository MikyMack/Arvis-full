const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// Create a new submission
router.post('/', submissionController.createSubmission);

// Get all submissions
router.get('/', submissionController.getSubmissions);

// Get submission by ID
router.get('/:id', submissionController.getSubmission);

// Delete submission
router.delete('/:id', submissionController.deleteSubmission);

module.exports = router;
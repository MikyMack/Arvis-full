const Submission = require('../models/Submission');
const nodemailer = require("nodemailer");

exports.createSubmission = async (req, res) => {
  try {
    const { name, email, phone, calculationType, calculationData, totalCost } = req.body;

    // Save submission in DB
    const submission = new Submission({
      name,
      email,
      phone,
      calculationType,
      calculationData,
      totalCost
    });

    await submission.save();

    // === Send Email Notification ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Arvies Website" <${process.env.MAIL_USER}>`,
      to: "arviesgroup@gmail.com",
      subject: "📩 New Submission Received",
      html: `
        <h2>New Submission Details</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Calculation Type:</b> ${calculationType}</p>
        <p><b>Calculation Data:</b> ${JSON.stringify(calculationData)}</p>
        <p><b>Total Cost:</b> ${totalCost}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send response
    res.status(201).json({
      success: true,
      message: "Submission saved successfully & notification sent",
      data: submission,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
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
const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

const blogController = require('../controllers/blogController');
const testimonialController = require('../controllers/testimonialController');
const architectureController = require('../controllers/architectureController');
const realEstateController = require('../controllers/realEstateController');
const interiorController = require('../controllers/interiorController');
const upload = require('../utils/multer');



router.post('/createArcitecture', upload.array('images', 10), architectureController.createArchitecture);
router.put('/editArcitecture/:id', upload.array('images', 10), architectureController.updateArchitecture);
router.get('/editArcitecture/:id', architectureController.getSingleArchitecture);
router.delete('/deleteArcitecture/:id', architectureController.deleteArchitecture);
router.patch('/toggleArcitecture/:id/toggle', architectureController.toggleArchitecture);

router.post('/createRealEstate', upload.array('images', 10), realEstateController.createRealEstate);
router.put('/editRealEstate/:id', upload.array('images', 10), realEstateController.updateRealEstate);
router.get('/editRealEstate/:id', realEstateController.getSingleRealEstate);
router.delete('/deleteRealEstate/:id', realEstateController.deleteRealEstate);
router.patch('/toggleRealEstate/:id/toggle', realEstateController.toggleRealEstate);

router.post('/createInterior', upload.array('images', 10), interiorController.createInterior);
router.put('/editInterior/:id', upload.array('images', 10), interiorController.updateInterior);
router.get('/editInterior/:id', interiorController.getSingleInterior);
router.delete('/deleteInterior/:id', interiorController.deleteInterior);
router.patch('/toggleInterior/:id/toggle', interiorController.toggleInterior);


// 📰 Blogs Routes
router.post('/admin-blogs', upload.single('image'), blogController.createBlog);
router.get('/get-admin-blogs', blogController.getAllBlogs);
router.get('/admin-blogs/:id', blogController.getBlogById);
router.put('/admin-blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/admin-blogs/:id', blogController.deleteBlog);

// Testimonials
router.post('/admin-testimonials', upload.single('image'), testimonialController.createTestimonial);
router.get('/testimonials', testimonialController.listTestimonials);
router.get('/admin-testimonials/:id', testimonialController.getTestimonialForEdit);
router.put('/admin-testimonials/:id', upload.single('image'), testimonialController.updateTestimonial);
router.delete('/admin-testimonials/:id', testimonialController.deleteTestimonial);
router.patch('/admin-testimonials/toggle-status/:id', testimonialController.toggleTestimonialStatus);

router.post("/send-realestate-form", async (req, res) => {
    const { name, phone, email, interestType, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: "arviesgroup@gmail.com",
            subject: "New Form Submission",
            html: `
                <h3>New Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Interested In:</strong> ${interestType}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: "Email failed to send" });
    }
});


module.exports = router;

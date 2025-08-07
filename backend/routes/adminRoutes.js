const express = require('express');

const Architecture = require("../models/Architecture")
const RealEstate = require("../models/RealEstate")
const Interior = require("../models/Interior")
const app = express();


const authMiddleware = require('../middleware/auth'); 
const authController =require('../controllers/authController');

// Admin Login Page
app.get('/login', (req, res) => {
    res.render('admin-login', { title: 'Admin Login' });
});
app.get('/logout', authController.logout);

app.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [architectures, totalArchitectures] = await Promise.all([
            Architecture.find().skip(skip).limit(limit),
            Architecture.countDocuments()
        ]);

        const totalPages = Math.ceil(totalArchitectures / limit);

        res.render('admin-dashboard', { 
            title: 'Admin Dashboard', 
            architectures,
            currentPage: page,
            totalPages,
            totalArchitectures,
            limit
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get('/admin-realEstate', authMiddleware, async (req, res) => {
    try {

        const realEstate = await RealEstate.find(); 

        res.render('admin-realestate', { title: 'Admin Categories', realEstate });
    } catch (error) {
        console.error("Error fetching realestate:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/admin-interiors', authMiddleware, async (req, res) => {
    try {

        const interior = await Interior.find(); 

        res.render('admin-interiors', { title: 'Admin Categories', interior });
    } catch (error) {
        console.error("Error fetching realestate:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/admin-blogs',authMiddleware, (req, res) => {
  res.render('admin-blogs');
});
app.get('/admin-testimonials',authMiddleware, (req, res) => {
  res.render('admin-testimonials');
});


module.exports = app;
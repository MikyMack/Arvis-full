const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog');
const Architecture = require('../models/Architecture');
const Interior = require('../models/Interior');
const Testimonials = require('../models/Testimonial');
const RealEstate = require('../models/RealEstate');
const MainBanner = require('../models/MainBanner');
const ArchitectureBanner = require('../models/BannerTwo');
const InteriorBanner = require('../models/BannerThree');
const RealEstateBanner = require('../models/BannerFour');

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        const mainBanners = await MainBanner.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const architectures = await Architecture.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        const interiors = await Interior.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        const realestate = await RealEstate.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        const testimonials = await Testimonials.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        res.render('index', {
            title: 'Home',
            blogs,
            mainBanners,
            architectures,
            interiors,
            testimonials,
            realestate
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading home page data');
    }
});

router.get('/about', async (req, res) => {
    try {
        const testimonials = await Testimonials.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        res.render('about', {
            title: 'About Us', testimonials
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading about us page data');
    }
});
router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalBlogs = await Blog.countDocuments();

        res.render('blogs', {
            title: 'Blogs',
            blogs: blogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBlogs / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading blogs page data');
    }
});
router.get('/architecture', async (req, res) => {
    try {
        const architectures = await Architecture.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(16)
            .lean();

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        const architectureBanner = await ArchitectureBanner.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.render('architecture', {
            title: 'architecture', architectures, architectureBanner,
            blogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading architecture page data');
    }
});

router.get('/contact', async (req, res) => {
    try {
        res.render('contact', { title: 'contact us' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});
router.get('/interior', async (req, res) => {
    try {

        const interiors = await Interior.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

            const interiorBanner = await InteriorBanner.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.render('interior', {
            title: 'Interiors', interiors, blogs,interiorBanner
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
router.get('/interiorDesign', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category;
        const location = req.query.location;

        let filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = location;
        }

        const total = await Interior.countDocuments(filter);

        const interiors = await Interior.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const categories = await Interior.distinct('category', { isActive: true });
        const locations = await Interior.distinct('location', { isActive: true });

        // Determine the dynamic title
        let dynamicTitle = 'Interior - Full Projects';
        if (category && category.trim() !== '') {
            dynamicTitle = `Interior - ${category} Projects`;
        }

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        res.render('interiorDesign', {
            title: dynamicTitle,
            interiors,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total,
            categories,
            locations,
            selectedCategory: category || '',
            selectedLocation: location || '',
            blogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/interiorExecution', async (req, res) => {
    try {
        res.render('interiorExecution', {
            title: 'interiorExecution'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
router.get('/realEstate', async (req, res) => {
    try {
        const realestate = await RealEstate.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(16)
            .lean();

            const realestateBanner = await RealEstateBanner.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        res.render('realEstate', {
            title: 'realEstate', realestate,realestateBanner
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/architectureDesigns', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category;
        const location = req.query.location;

        let filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = location;
        }

        const total = await Architecture.countDocuments(filter);

        const architectures = await Architecture.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const categories = await Architecture.distinct('category', { isActive: true });
        const locations = await Architecture.distinct('location', { isActive: true });

        // Determine the dynamic title
        let dynamicTitle = 'Architecture - Full Projects';
        if (category && category.trim() !== '') {
            dynamicTitle = `Architecture - ${category} Projects`;
        }

        res.render('architectureDesigns', {
            title: dynamicTitle,
            architectures,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total,
            categories,
            locations,
            selectedCategory: category || '',
            selectedLocation: location || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/projects', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const category = req.query.category;
        const location = req.query.location;

        let filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = location;
        }

        const total = await RealEstate.countDocuments(filter);

        const realestate = await RealEstate.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const categories = await RealEstate.distinct('category', { isActive: true });
        const locations = await RealEstate.distinct('location', { isActive: true });

        res.render('projects', {
            title: 'Real Estate Projects',
            realestate,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total,
            categories,
            locations,
            selectedCategory: category || '',
            selectedLocation: location || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/projectDetails/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Project ID is required');
        }

        const realestate = await RealEstate.findById(id).lean();
        if (!realestate) {
            return res.status(404).send('Project not found');
        }

        res.render('projectDetails', { realestate });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
router.get('/architectureDetails/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Architecture ID is required');
        }

        const architecture = await Architecture.findById(id).lean();
        if (!architecture) {
            return res.status(404).send('Architecture not found');
        }

        res.render('architectureDetails', {
            title: architecture.title || 'Architecture Details',
            architecture
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
router.get('/interior/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('interior ID is required');
        }

        const interior = await Interior.findById(id).lean();
        if (!interior) {
            return res.status(404).send('interior not found');
        }

        res.render('interiorDetails', {
            title: interior.title || 'interior Details',
            interior
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/blogdetails/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send('Blog ID is required');
        }

        const blog = await Blog.findById(id).lean();

        if (!blog) {
            return res.status(404).send('Blog not found');
        }


        res.render('blogdetails', {
            title: blog.title || 'Blog Details',
            blog: blog

        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading blog details page data');
    }
});


module.exports = router;
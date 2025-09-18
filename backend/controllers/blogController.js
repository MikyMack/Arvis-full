const Blog = require('../models/Blog');
const cloudinary = require('../utils/cloudinary');

exports.createBlog = async (req, res) => {
    try {
        const { title, metaTitle, metaDescription, metaKeywords, content, author, highlights } = req.body;
        
        if (!title || !metaTitle || !metaDescription || !metaKeywords || !content || !author) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!req.file) return res.status(400).json({ message: "Blog image is required" });

        const result = await cloudinary.uploader.upload(req.file.path);

        let highlightsArr = [];
        if (typeof highlights !== 'undefined') {
            if (Array.isArray(highlights)) {

                if (highlights.length === 1 && typeof highlights[0] === 'string' && highlights[0].trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(highlights[0]);
                        if (Array.isArray(parsed)) {
                            highlightsArr = parsed.map(h => h.trim()).filter(h => h.length > 0);
                        } else {
                            highlightsArr = [];
                        }
                    } catch (e) {
    
                        highlightsArr = highlights[0].split(',').map(h => h.trim()).filter(h => h.length > 0);
                    }
                } else {
                    highlightsArr = highlights.map(h => h.trim()).filter(h => h.length > 0);
                }
            } else if (typeof highlights === 'string' && highlights.trim() !== '') {
           
                if (highlights.trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(highlights);
                        if (Array.isArray(parsed)) {
                            highlightsArr = parsed.map(h => h.trim()).filter(h => h.length > 0);
                        } else {
                            highlightsArr = [];
                        }
                    } catch (e) {
             
                        highlightsArr = highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
                    }
                } else {
                    highlightsArr = highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
                }
            }
        }

        const newBlog = new Blog({
            title,
            metaTitle,
            metaDescription,
            metaKeywords: metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
            content,
            author,
            imageUrl: result.secure_url,
            cloudinary_id: result.public_id,
            highlights: highlightsArr
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", newBlog });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { title, metaTitle, metaDescription, metaKeywords, content, author, highlights } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (req.file) {
            await cloudinary.uploader.destroy(blog.cloudinary_id);
            const result = await cloudinary.uploader.upload(req.file.path);
            blog.imageUrl = result.secure_url;
            blog.cloudinary_id = result.public_id;
        }

        blog.title = title || blog.title;
        blog.metaTitle = metaTitle || blog.metaTitle;
        blog.metaDescription = metaDescription || blog.metaDescription;
        blog.metaKeywords = metaKeywords ? metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : blog.metaKeywords;
        blog.content = content || blog.content;
        blog.author = author || blog.author;


        if (typeof highlights !== 'undefined') {
            let highlightsArr = [];
            if (Array.isArray(highlights)) {
                if (highlights.length === 1 && typeof highlights[0] === 'string' && highlights[0].trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(highlights[0]);
                        if (Array.isArray(parsed)) {
                            highlightsArr = parsed.map(h => h.trim()).filter(h => h.length > 0);
                        } else {
                            highlightsArr = [];
                        }
                    } catch (e) {
                        highlightsArr = highlights[0].split(',').map(h => h.trim()).filter(h => h.length > 0);
                    }
                } else {
                    highlightsArr = highlights.map(h => h.trim()).filter(h => h.length > 0);
                }
            } else if (typeof highlights === 'string' && highlights.trim() !== '') {
                if (highlights.trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(highlights);
                        if (Array.isArray(parsed)) {
                            highlightsArr = parsed.map(h => h.trim()).filter(h => h.length > 0);
                        } else {
                            highlightsArr = [];
                        }
                    } catch (e) {
                        highlightsArr = highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
                    }
                } else {
                    highlightsArr = highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
                }
            }
            blog.highlights = highlightsArr;
        }

        await blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error: error.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blogs", error: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving blog", error: error.message });
    }
};



exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        await cloudinary.uploader.destroy(blog.cloudinary_id);
        await Blog.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error: error.message });
    }
};

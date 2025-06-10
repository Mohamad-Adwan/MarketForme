const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/'); // Make sure this directory exists
//   },
//   filename: function(req, file, cb) {
//     cb(null, `project-${Date.now()}-${file.originalname}`);
//   }
// });

const upload = multer({storage: multer.memoryStorage()});


// Get all projects
router.get('/', projectController.getAllProjects);

// Get a project by ID
router.get('/:id', projectController.getProjectById);

// Get featured projects
// router.get('/featured', projectController.getFeaturedProjects);



// Add new project (admin only)
router.post('/',upload.single('image'), projectController.addProject);

// Update project (admin only)
router.put('/:id',upload.single('image'), projectController.updateProject);

// Delete project (admin only)
router.delete('/:id', projectController.deleteProject);

module.exports = router;
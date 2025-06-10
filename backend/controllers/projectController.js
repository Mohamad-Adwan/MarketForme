const { Project } = require('../models/projectModel');
const path = require('path');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

const multer = require('multer');
const { console } = require('inspector');
const storage = multer.memoryStorage();  // Store file in memory
const upload = multer({ storage: storage }).single('image');  // Accept single file upload
const projectController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find();
      const projectsWithBase64Images = projects.map((project) => {
        const base64Image =
          project.image && project.image.data && Buffer.isBuffer(project.image.data)
            ? `data:${project.image.contentType};base64,${project.image.data.toString('base64')}`
            : null;
      
        return {
          id4: project.id4,
          name: project.name,
          
          description: project.description,
         
         
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          image: base64Image, // Now it's a clean string
        };
      });
      res.json(projectsWithBase64Images);
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({ error: 'Failed to get projects' });
    }
  },

  // Get project by ID
  getProjectById: async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ id4: id }); // Find one project by id4

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Convert image buffer to Base64 if image exists
    const base64Image = project.image?.data && Buffer.isBuffer(project.image.data)
      ? `data:${project.image.contentType};base64,${project.image.data.toString('base64')}`
      : null;

    const formattedProject = {
      id4: project.id4,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      image: base64Image,
    };

    res.json(formattedProject);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
}
,

  // Get featured projects
//   getFeaturedProjects: async (req, res) => {
//     try {
//       const projects = await projectModel.getFeaturedProjects();
//       res.json(projects);
//     } catch (error) {
//       console.error('Error getting featured projects:', error);
//       res.status(500).json({ error: 'Failed to get featured projects' });
//     }
//   },

  // Upload project image
 

  // Add new project
  addProject: async (req, res) => {
    const projectData = req.body;
      const  file  = req.file;
          console.log(file);

     const fileBinary = new mongodb.Binary(file.buffer);
    try {
      
        if (file) {
const fileDocument = {
  data: fileBinary,
  contentType: file.mimetype,
  FileName: file.originalname,
};
 projectData.image = fileDocument; // Store the image as binary data
  
}
 const newProject = new Project(projectData);
 await newProject.save();
       res.status(201).json({
        success: true,
        project: newProject,
      });

    } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ error: 'Failed to add project' });
    }
  },

  // Update project
  updateProject: async (req, res) => {
       const { id } = req.params;
      const projectData = req.body;
       const file = req.file;
      isUpdated = false;

    try {
     
      // If there's a new image file uploaded, add it to the update fields
      if(file) {
      const updatedProject = await Project.findOneAndUpdate(
        {id4:id},
        {
          image: {
            data: file.buffer,
            contentType: file.mimetype,
            FileName: file.originalname
          },
          name: projectData.name,
         
          description: projectData.description,
          
        //   category: ProjectData.category,
         
        },
        { new: true }
      );
      isUpdated = true;
    }
    else {
      const updatedProject = await Project.findOneAndUpdate(
        { id4: id }, // If you're using custom `id`, keep this. Otherwise, use `_id`.
        {
          name: projectData.name,
          
          description: projectData.description,
          
          
        //   category: ProjectData.category,
        },
        { new: true } // Return the updated document
      );
      isUpdated = true;
    }
  
      if (!isUpdated) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json(isUpdated);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  // Delete project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      deleted = await Project.findOneAndDelete({ id4: id });      
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
};

module.exports = projectController;

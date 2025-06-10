
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const path = require('path');

// Create a GridFS stream instance
const conn = mongoose.connection;


const projectSchema = new mongoose.Schema({
  id4: { type: Number,unique: true }, // Auto-increment field
  name: { type: String, required: true },
  
  
  description: String,
  
 // image: { type: String }, // Store the image as binary data (Buffer)
  image: {
    data: Buffer,
    contentType: String,
    FileName: String,
  },
  // imagePath: { type: String }, // Store the path to the image file
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add auto-increment plugin to schema
projectSchema.plugin(AutoIncrement, { inc_field: 'id4' , counter_name: 'project_counter' });

const Project = mongoose.model('Project', projectSchema);


  // Pipe the file data into GridFS

 
 

module.exports = { Project };


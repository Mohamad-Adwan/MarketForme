
const dotenv = require('dotenv');
dotenv.config();

// This file would contain your actual database connection code
// Uncomment the relevant section when ready to connect to a real database

// MySQL database connection
/*
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
*/

// MongoDB database connection
/*
const { MongoClient } = require('mongodb');

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// Or with MongoDB Atlas:
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const dbConnection = client.db(process.env.DB_NAME);

module.exports = dbConnection;
*/

// For now, we'll continue using the mock database
const db = require('./db');

module.exports = db;

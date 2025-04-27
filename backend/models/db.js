const mongoose = require("mongoose");

const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL); // Removed deprecated options
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = db;
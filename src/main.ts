import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// Import files
import { dataBase } from './database/database';
import mainRoutes from './api/routes';

// Configs
const app = express();
const port = process.env.PORT || 3000;

// Start database
dataBase.startDb();

// app use
app.use(json());
app.use(cors());

// Routes
app.use(mainRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
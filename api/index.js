import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from "cookie-parser";


dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB!");
}).catch((err) => {
    console.log(err);
});

// Create an instance of the Express application
const app = express();

app.use(express.json());

app.use(cookieParser());

// Start the Express application and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on port: 3000");
});

//route for API endpoints
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing',listingRouter);

// Middleware for handling errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Error!';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

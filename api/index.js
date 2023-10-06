import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


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

// Start the Express application and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on port: 3000");
});

//route for API endpoints
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

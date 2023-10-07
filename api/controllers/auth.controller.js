import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hasedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hasedPassword });
    try {
        await newUser.save();
        res.status(201).json("User created succesfully!");
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        const validUser = await User.findOne({ email });
        if (!validUser)
            return next(errorHandler(404, 'Invalid email or password. 😬'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword)
            return next(errorHandler(401, 'Invalid email or password. 😬'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        // Remove the password field from the user data
        const { password: pass, ...rest } = validUser._doc;

        // Set the 'access_token' cookie with the JWT, and make it HTTP-only Also, set the cookie to expire in 7 days
        res.cookie('access_token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error)
    }
};

// Define a GOOGLE route handler
export const google = async (req, res, next) => {
    try {

        // Check if a user with the provided email already exists in the database
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // User already exists, generate a JWT for authentication
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

            // Remove the password field from the user data
            const { password: hashedPassword, ...rest } = existingUser._doc;

            // Set the 'access_token' cookie with the JWT and make it HTTP-only
            res.cookie('access_token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }) //set the cookie to expire in 7 days
                .status(200)
                .json(rest);
        } else {
            // User doesn't exist, generate a random password and create a new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            });

            // Save the new user to the database
            await newUser.save();

            // Generate a JWT for authentication
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

            // Remove the password field from the user data
            const { password: hashedPassword2, ...rest } = newUser._doc;

            // Set the 'access_token' cookie with the JWT and make it HTTP-only
            res.cookie('access_token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }) //set the cookie to expire in 7 days
                .status(200)
                .json(rest);
        }
    } catch (error) {
        // Handle any errors that occur during the authentication process
        next(error);
    }
}
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';


export const test = (req, res) => {
    res.json({
        message: ' Test'
    });
};

//UPDATE User
export const updateUser = async (req, res, next) => {

    // Check if the user ID in the request matches the user's own ID
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'));
    }
    try {

        // If a new password is provided, hash it
        if (req.body.password) {
            req.biody.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Update the user's information in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            {
                new: true
            }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

};
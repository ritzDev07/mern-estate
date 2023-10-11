import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }

};

export const deleteListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, ' You can only delete your own listings!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');

    } catch (error) {
        next(error);

    }
};

export const updateListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, ' You can Update you own listings1'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing)

    } catch (error) {
        next(error);
    };

};

export const getListing = async (req, res, next) => {

    try {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        res.status(200).json(listing);

    } catch (error) {
        next(error);
    };

};

export const getListings = async (req, res, next) => {
    try {
        const {
            limit = 9,
            startIndex = 0,
            offer = { $in: [false, true] },
            furnished = { $in: [false, true] },
            parking = { $in: [false, true] },
            type = { $in: ['sale', 'rent'] },
            searchTerm = '',
            sort = 'createdAt',
            order = 'desc',
        } = req.query;

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
const Trip = require("../models/Trip");


// CREATE TRIP
const createTrip = async (req, res) => {

    try {

        const {
            user,
            title,
            description,
            from,
            to
        } = req.body;

        const media = req.files
            ? req.files.map((file) => file.location)
            : [];

        const newTrip = await Trip.create({
            user,
            title,
            description,
            from,
            to,
            media
        });

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            trip: newTrip
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// GET ALL TRIPS
const getAllTrips = async (req, res) => {

    try {

        const trips = await Trip.find()
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            trips
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// GET SINGLE TRIP
const getSingleTrip = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id)
            .populate("user", "username profilePic")
            .populate("comments.user", "username profilePic");

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        res.status(200).json({
            success: true,
            trip
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// LIKE TRIP
const likeTrip = async (req, res) => {

    try {

        const { userId } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        const alreadyLiked = trip.likes.includes(userId);

        if (alreadyLiked) {

            trip.likes = trip.likes.filter(
                (id) => id.toString() !== userId
            );

        } else {

            trip.likes.push(userId);

        }

        await trip.save();

        res.status(200).json({
            success: true,
            likes: trip.likes.length
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// COMMENT TRIP
const commentTrip = async (req, res) => {

    try {

        const { userId, text } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }

        trip.comments.push({
            user: userId,
            text
        });

        await trip.save();

        res.status(200).json({
            success: true,
            message: "Comment added"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



module.exports = {
    createTrip,
    getAllTrips,
    getSingleTrip,
    likeTrip,
    commentTrip
};
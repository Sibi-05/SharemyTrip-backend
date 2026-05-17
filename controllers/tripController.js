const Trip = require("../models/Trip");

// CREATE TRIP
const createTrip = async (req, res) => {
  try {
    const {
      title,
      from,
      to,
      description,
    } = req.body;

    const media = req.files.map((file) => ({
      url: file.location,
      mediaType: file.mimetype.startsWith("video")
        ? "video"
        : "image",
    }));

    const trip = await Trip.create({
      user: req.user,
      title,
      from,
      to,
      description,
      media,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
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
      trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
        message: "Trip not found",
      });
    }

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIKE TRIP
const likeTrip = async (req, res) => {
  try {
    const userId = req.user; // ✅ FIXED
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
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
      likes: trip.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// COMMENT TRIP
const commentTrip = async (req, res) => {
  try {
    const userId = req.user; // ✅ FIXED
    const { text } = req.body;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    trip.comments.push({
      user: userId,
      text,
    });

    await trip.save();

    res.status(200).json({
      success: true,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getSingleTrip,
  likeTrip,
  commentTrip,
};

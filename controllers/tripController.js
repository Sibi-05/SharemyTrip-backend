const Trip = require("../models/Trip");
const User = require("../models/User");

const createTrip = async (req, res) => {
  try {
    const { title, from, to, description } = req.body;

    const media = req.files.map((file) => ({
      url: file.location,
      mediaType: file.mimetype.startsWith("video") ? "video" : "image",
    }));

    // 1. create trip
    const trip = await Trip.create({
      user: req.user,
      title,
      from,
      to,
      description,
      media,
    });

    // 2. push trip into user
    await User.findByIdAndUpdate(
      req.user,
      {
        $push: { trips: trip._id },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      trip,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TRIPS
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
  .populate("user", "username profilePic")
  .populate(
    "comments.user",
    "username profilePic"
  )
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

    const userId = req.user;

    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const alreadyLiked = trip.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {

      trip.likes = trip.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

    } else {

      trip.likes.push(userId);

    }

    await trip.save();

    const updatedTrip = await Trip.findById(tripId)
      .populate("user", "username profilePic");

    res.status(200).json({
      success: true,
      trip: updatedTrip,
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

    const userId = req.user;

    const { text } = req.body;

    const tripId = req.params.id;

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

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

    const updatedTrip =
      await Trip.findById(tripId)
        .populate(
          "user",
          "username profilePic"
        )
        .populate(
          "comments.user",
          "username profilePic"
        );

    res.status(200).json({
      success: true,
      trip: updatedTrip,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteTrip = async (
  req,
  res
) => {
  try {

    const { tripId } =
      req.params;

    const trip =
      await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // OWNER CHECK
    if (
      trip.user.toString() !==
      req.user
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await Trip.findByIdAndDelete(
      tripId
    );

    res.status(200).json({
      success: true,
      message:
        "Trip deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getSingleTrip,
  likeTrip,
  commentTrip,
  deleteTrip
};

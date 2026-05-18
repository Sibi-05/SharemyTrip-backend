const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user;

    const {
      fullName,
      username,
      bio,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // UPDATE TEXT FIELDS

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    // UPDATE PROFILE IMAGE

    if (req.file) {
      user.profilePic = req.file.location;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password").populate("trips");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  getProfile,
};

module.exports = {
  updateProfile,
  getProfile,
};

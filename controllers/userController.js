const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user;

    const { fullName, username, bio } = req.body;

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
    const user = await User.findById(req.user)
      .select("-password")
      .populate("trips");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "trips",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const currentUserId = req.user;

    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);

    const targetUser = await User.findById(targetUserId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    // SAFE ARRAYS

    if (!Array.isArray(currentUser.following)) {
      currentUser.following = [];
    }

    if (!Array.isArray(targetUser.followers)) {
      targetUser.followers = [];
    }

    const alreadyFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId,
    );

    if (alreadyFollowing) {
      // UNFOLLOW

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId,
      );

      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId,
      );
    } else {
      // FOLLOW

      targetUser.followers.push(currentUserId);

      currentUser.following.push(targetUserId);
    }

    await currentUser.save();

    await targetUser.save();

    return res.status(200).json({
      success: true,
      following: !alreadyFollowing,
    });
  } catch (error) {
    console.log("FOLLOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  getProfile,
  getUserProfile,
  followUser,
};

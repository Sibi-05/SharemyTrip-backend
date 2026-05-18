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
const getUserProfile =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      )
      .select(
        "-password"
      )
      .populate({
        path: "trips",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });

    if (!user) {

      return res.status(404)
        .json({
          success: false,
          message:
            "User not found",
        });

    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

const followUser = async (
  req,
  res
) => {

  try {

    const currentUser =
      await User.findById(
        req.user.id
      );

    const targetUser =
      await User.findById(
        req.params.id
      );

    if (!targetUser) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    // CAN'T FOLLOW SELF

    if (
      currentUser._id.toString() ===
      targetUser._id.toString()
    ) {

      return res.status(400).json({
        message:
          "You can't follow yourself",
      });

    }

    const alreadyFollowing =
      currentUser.following.includes(
        targetUser._id
      );

    if (alreadyFollowing) {

      // UNFOLLOW

      currentUser.following =
        currentUser.following.filter(
          (id) =>
            id.toString() !==
            targetUser._id.toString()
        );

      targetUser.followers =
        targetUser.followers.filter(
          (id) =>
            id.toString() !==
            currentUser._id.toString()
        );

    } else {

      // FOLLOW

      currentUser.following.push(
        targetUser._id
      );

      targetUser.followers.push(
        currentUser._id
      );

    }

    await currentUser.save();

    await targetUser.save();

    res.json({
      following:
        !alreadyFollowing,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error",
    });

  }
};

module.exports = {
  updateProfile,
  getProfile,
  getUserProfile,
  followUser
};

const User = require("../models/User");


const uploadProfileImage = async (req, res) => {

    try {

        const userId = req.user;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.profilePic = req.file.location;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile image uploaded",
            profilePic: user.profilePic
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch profile",
    });
  }
};

module.exports = {
  getProfile,
};

module.exports = {
    uploadProfileImage,
    getProfile
};
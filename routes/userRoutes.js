const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  updateProfile,
  getProfile,
  getUserProfile,
  followUser
} = require("../controllers/userController.js");
const { registerUser, loginUser } = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile,
);
router.get("/profile", authMiddleware, getProfile);

router.get(
  "/:id",
  getUserProfile
);

router.put(
  "/follow/:id",
  authMiddleware,
  followUser
);

module.exports = router;

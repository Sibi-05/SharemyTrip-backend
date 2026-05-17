const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  uploadProfileImage,
  getProfile,
} = require("../controllers/userController.js");
const { registerUser, loginUser } = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put(
  "/profile-image",
  authMiddleware,
  upload.single("profilePic"),
  uploadProfileImage,
);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;

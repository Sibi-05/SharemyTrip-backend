const express = require("express");

const upload = require("../middleware/upload");

const {
  createTrip,
  getAllTrips,
  getSingleTrip,
  likeTrip,
  commentTrip,
  deleteTrip,
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, upload.array("media", 10), createTrip);

router.get("/", getAllTrips);

router.get("/:id", getSingleTrip);

router.delete("/:id", authMiddleware, deleteTrip);

router.put("/:id/like", authMiddleware, likeTrip);

router.put("/:id/comment", authMiddleware, commentTrip);

module.exports = router;

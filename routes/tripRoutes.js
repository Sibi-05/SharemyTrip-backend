const express = require("express");

const upload = require("../middleware/upload");

const {
    createTrip,
    getAllTrips,
    getSingleTrip,
    likeTrip,
    commentTrip,
    deleteTrip
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
    "/create",
    authMiddleware,
    upload.array("media", 10),
    createTrip
);


router.get(
    "/",
    getAllTrips
);


router.get(
    "/:id",
    authMiddleware,
    getSingleTrip
);


router.put(
    "/:id/like",
    authMiddleware,
    likeTrip
);


router.put(
    "/:id/comment",
    authMiddleware,
    commentTrip
);

router.delete("/:id", authMiddleware, deleteTrip);


module.exports = router;
const express = require("express");

const upload = require("../middleware/upload");

const {
    createTrip,
    getAllTrips,
    getSingleTrip,
    likeTrip,
    commentTrip
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
    "/like/:id",
    authMiddleware,
    likeTrip
);


router.put(
    "/comment/:id",
    authMiddleware,
    commentTrip
);


module.exports = router;
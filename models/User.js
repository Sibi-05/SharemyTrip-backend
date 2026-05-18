const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    profilePic: {
        type: String,
        default: "https://i.pinimg.com/736x/7e/b4/56/7eb4567657b2ff39de528ec948b79797.jpg"
    },

    bio: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        }
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    likedTrips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        }
    ],

},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);
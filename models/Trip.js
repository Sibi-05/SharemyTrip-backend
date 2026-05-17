const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    from: {
        type: String,
        required: true
    },

    to: {
        type: String,
        required: true
    },

    media: [
        {
            type: String,
            required: true
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            text: {
                type: String,
                required: true
            },

            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Trip", tripSchema);
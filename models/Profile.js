const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    handle: {
        type: String,
        required: true,
        unique: true,
        max: 40
    },
    gender: {
        type: String,
        enum: ["male", "female", "diverse"]
    },
    country: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    club: {
        type: String
    },
    social: {
        telephone: String,
        website: String,
        facebook: String,
        youtube: String,
        twitter: String,
        instagram: String
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
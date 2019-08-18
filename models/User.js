const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

module.exports = User = mongoose.model("user", UserSchema);
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Load user model
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// Load input validation
const validateRegisterInput = require("../../validation/register");

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {

    // Validate request
    const { error, value } = validateRegisterInput(req.body);
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) { return res.status(400).json({ message: "E-Mail already exists" }); }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, config.get("secret"), { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/users
// @desc    Delete a user
// @access  Private
router.delete("/", auth, async (req, res) => {

    try {
        // TODO: Remove all the users animals 

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ message: "User deleted" })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
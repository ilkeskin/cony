const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Load user model
const User = require("../../models/User");

// Load input validation
const validateLoginInput = require("../../validation/login");

// @route   POST api/auth
// @desc    Authenticate a user in aka. log in
// @access  Public
router.post("/", async (req, res) => {

    const { error, value } = validateLoginInput(req.body);
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

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

// @route   GET api/auth
// @desc    Return currently authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
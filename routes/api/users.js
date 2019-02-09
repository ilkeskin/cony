const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load user model
const User = require("../../models/User");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { error, value } = validateRegisterInput(req.body);

  // Check validation result
  if (error !== null) {
    return res.status(400).json(error.details);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "E-Mail already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Log a user in a.k.a. returning a JSON Web Token (JWT)
// @access  Public
router.post("/login", (req, res) => {
  const { error, value } = validateLoginInput(req.body);

  // Check validation result
  if (error !== null) {
    return res.status(400).json(error.details);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find the user by E-Mail
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT payload
        const payload = { id: user.id, name: user.name };
        // Sign the token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (error, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;

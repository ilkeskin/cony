const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "E-Mail already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(error => console.log(error));
        });
      });
    }
  });
});

module.exports = router;

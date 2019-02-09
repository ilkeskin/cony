const express = require("express");
const router = express.Router();

// @route   GET api/profiles/
// @desc    Description
// @access  Public
router.get("/", (req, res) => res.json());

module.exports = router;
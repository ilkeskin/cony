const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Load models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load input validation
const validateProfileInput = require("../../validation/profile");

// @route   GET api/profiles
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", "name");
        if (profiles.length === 0) {
            return res.status(404).json({ message: "There are no profiles" });
        }
        res.json(profiles);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/profiles/me
// @desc    Get my profile
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name");
        if (!profile) {
            return res.status(404).json({ message: "There is no profile for the current user" });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/profiles/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", async (req, res) => {
    try {
        let profile = await Profile.findOne({ handle: req.params.handle }).populate("user", "name");
        if (!profile) {
            return res.status(404).json({ message: "There is no profile for the user with the given handle" });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.params.user_id }).populate("user", "name");
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == "ObjectId") {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(500).send("Server error");
    }
});

// @route   POST api/profiles
// @desc    Create profile for current user
// @access  Private
router.post("/", auth, async (req, res) => {
    const { error, value } = validateProfileInput(req.body, req.method);
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    try {
        const profileFields = parseProfileFromBody(req);

        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            return res.status(409).json({ message: "A profile for this user already exists" });
        } else {
            let profileHandleExist = await Profile.findOne({ handle: profileFields.handle });
            if (profileHandleExist) {
                return res.status(400).json({ message: "That handle already exists" });
            }
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/profiles
// @desc    Modify profile for current user
// @access  Private
router.put("/", auth, async (req, res) => {
    const { error, value } = validateProfileInput(req.body, req.method);
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    try {
        const profileFields = parseProfileFromBody(req);

        let profile = await Profile.findOneAndUpdate({ user: req.user.id }, profileFields, { new: true });
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: "The profile for this user does not exist" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

function parseProfileFromBody(req) {
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.country) profileFields.country = req.body.country;
    if (req.body.club) profileFields.club = req.body.club;

    if (req.body.address) {
        profileFields.address = {};
        if (req.body.address.street)
            profileFields.address.street = req.body.address.street;
        if (req.body.address.city) profileFields.address.city = req.body.address.city;
        if (req.body.address.state)
            profileFields.address.state = req.body.address.state;
        if (req.body.address.zip) profileFields.address.zip = req.body.address.zip;
    }

    if (req.body.social) {
        profileFields.social = {};
        if (req.body.social.telephone)
            profileFields.social.telephone = req.body.social.telephone;
        if (req.body.social.website)
            profileFields.social.website = req.body.social.website;
        if (req.body.social.facebook)
            profileFields.social.facebook = req.body.social.facebook;
        if (req.body.social.youtube)
            profileFields.social.youtube = req.body.social.youtube;
        if (req.body.social.twitter)
            profileFields.social.twitter = req.body.social.twitter;
        if (req.body.social.instagram)
            profileFields.social.instagram = req.body.social.instagram;
    }

    return profileFields;
}

module.exports = router;
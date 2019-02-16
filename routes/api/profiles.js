const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Load input validation
const validateProfileInput = require("../../validation/profile");

// @route   GET api/profiles
// @desc    Get all profiles
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find()
        .populate("user", "name")
        .then(profiles => {
            if (!profiles) {
                return res.status(404).json({ message: "There are no profiles" });
            }
            res.json(profiles);
        })
        .catch(err => res.status(500).json(err));
});

// @route   GET api/profiles/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
    Profile.findOne({ handle: req.params.handle })
        .populate("user", "name")
        .then(profile => {
            if (!profile) {
                res.status(404).json({ message: "There is no profile for the user with the given handle" });
            }
            res.json(profile);
        })
        .catch(err => res.status(500).json(err));
});

// @route   GET api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
    Profile.findOne({ user: req.params.user_id })
        .populate("user", "name")
        .then(profile => {
            if (!profile) {
                res.status(404).json({ message: "There is no profile for the user with the given ID" });
            }
            res.json(profile);
        })
        .catch(err => res.status(500).json(err));
});

// @route   POST api/profiles
// @desc    Create profile for current user
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { error, value } = validateProfileInput(req.body, req.method);

    // Check validation result
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    // Parse fields from body
    const profileFields = parseProfileFromBody(req);
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            res.status(409).json({ message: "A profile for this user already exists" });
        } else {
            // Create
            // Check if handle exist
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                    return res.status(400).json({ message: "That handle already exists" });
                }
            });

            // Save the profile
            new Profile(profileFields).save().then(profile => res.json(profile));
        }
    });
});

// @route   PUT api/profiles/user/:user_id
// @desc    Modify profile for current user
// @access  Private
router.put("/user/:user_id", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.id === req.params.user_id) {
        const { error, value } = validateProfileInput(req.body, req.method);

        // Check validation result
        if (error !== null) {
            return res.status(400).json(error.details);
        }

        const profileFields = parseProfileFromBody(req);
        Profile.findOneAndUpdate(req.params.user_id, profileFields, { new: true })
            .then(profile => {
                if (profile) {
                    res.json(profile);
                } else {
                    res.status(404).json({ message: "The profile for this user does not exist" });
                }
            });
    } else {
        res.status(403).json({ message: "Cannot update the profile of another user" });
    }
});

function parseProfileFromBody(req) {
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.country) profileFields.country = req.body.country;
    if (req.body.club) profileFields.club = req.body.club;

    if (req.body.adress) {
        profileFields.adress = {};
        if (req.body.adress.street)
            profileFields.adress.street = req.body.adress.street;
        if (req.body.adress.city) profileFields.adress.city = req.body.adress.city;
        if (req.body.adress.state)
            profileFields.adress.state = req.body.adress.state;
        if (req.body.adress.zip) profileFields.adress.zip = req.body.adress.zip;
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
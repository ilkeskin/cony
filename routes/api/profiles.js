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
// @access  Private
router.get("/", auth, (req, res) => {
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
router.post("/", auth, (req, res) => {
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
// router.put("/user/:user_id", auth, (req, res) => {
//     if (req.user.id === req.params.user_id) {
//         const { error, value } = validateProfileInput(req.body, req.method);

//         // Check validation result
//         if (error !== null) {
//             return res.status(400).json(error.details);
//         }

//         const profileFields = parseProfileFromBody(req);
//         Profile.findOneAndUpdate(req.params.user_id, profileFields, { new: true })
//             .then(profile => {
//                 if (profile) {
//                     res.json(profile);
//                 } else {
//                     res.status(404).json({ message: "The profile for this user does not exist" });
//                 }
//             });
//     } else {
//         res.status(403).json({ message: "Cannot update the profile of another user" });
//     }
// });

// @route   PUT api/profiles
// @desc    Modify profile for current user
// @access  Private
router.put("/", auth, (req, res) => {
    const { error, value } = validateProfileInput(req.body, req.method);

    // Check validation result
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    const profileFields = parseProfileFromBody(req);
    Profile.findOneAndUpdate(req.user.id, profileFields, { new: true })
        .then(profile => {
            if (profile) {
                res.json(profile);
            } else {
                res.status(404).json({ message: "The profile for this user does not exist" });
            }
        });
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
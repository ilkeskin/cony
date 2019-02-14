const express = require("express");
const router = express.Router();

// Load models
const Profile = require("../../models/Profile");

// Load input validation
const validateAnimalInput = require("../../validation/animal");

// @route   GET api/animals
// @desc    Get all animals
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.find()
      .then(animals => {
        if (!animals) {
          return res.status(404).json({
            message: "There are no animals"
          });
        }
        res.json(animals);
      })
      .catch(err => res.status(500).json(err));
  }
);

// @route   POST api/animals
// @desc    Create animal
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }), (req, res) => {
    const {
      error,
      value
    } = validateAnimalInput(req.body);

    // Check validation result
    if (error !== null) {
      return res.status(400).json(error.details);
    }

    // Parse fields from body
    // TODO: Write parseAnimalFromBody method
    const animalFields = parseAnimalFromBody(req);
    // TODO: Find primary key for animal to see if animal already exists
    Profile.findOne({
        animal: req.user.id
      })
      .then(animal => {
        if (animal) {
          res
            .status(409)
            .json({
              message: "An animal already exists"
            });
        } else {

        }
        // Save the profile
        new Animal(animalFields).save().then(animal => res.json(animal));
      });
  });

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load models
const Animal = require("../../models/Animal");
const Weight = require("../../models/Weight");

// Load input validation
const validateAnimalInput = require("../../validation/animal");
const validateWeightInput = require("../../validation/weight");

// @route   GET api/animals
// @desc    Get all animals
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Animal.find()
        .then(animals => {
            if (!animals) {
                return res.status(404).json({ message: "There are no animals" });
            }
            res.json(animals);
        })
        .catch(err => res.status(500).json(err));
});

// @route   GET api/animals/user/:user_id
// @desc    Get all animals for a specific user
// @access  Public
router.get("/user/:user_id", (req, res) => {
    Animal.find({ user: req.params.user_id })
        .then(animals => {
            if (!animals) {
                res.status(404).json({ message: "There are no animals for the given user" });
            }
            res.json(animals);
        })
        .catch(err => res.status(500).json(err));
});

// @route   GET api/animals/:animal_id
// @desc    Get animal by ID
// @access  Public
router.get("/:animal_id", (req, res) => {
    Animal.findById(req.params.animal_id)
        .then(animal => {
            if (!animal) {
                res.status(404).json({ message: "There is no animal with the given ID" });
            }
            res.json(animal);
        })
        .catch(err => res.status(500).json(err));
});

// @route   GET api/animals/:animal_id/weight[?from=<date>&to=<date>]
// @desc    Get weight data for a specific animal
// @access  Private
router.get("/:animal_id/weight", passport.authenticate("jwt", { session: false }), (req, res) => {
    // Filter weight data by date
    if (req.query) {
        from = (req.query.from) ? new Date(req.query.from) : new Date();
        to = (req.query.to) ? new Date(req.query.to) : new Date();
    }

    Weight.find({
            animal: req.params.animal_id,
            timestamp_month: {
                $gte: from.toISOString(),
                $lte: to.toISOString()
            }
        })
        .then(weights => {
            if (!weights) {
                res.status(404).json({ message: "There is no weight data for the animal with the given ID" });
            }
            res.json(weights);
        })
        .catch(err => res.status(500).json(err));
});

// @route   POST api/animals
// @desc    Create animal
// @access  Private
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { error, value } = validateAnimalInput(req.body, req.method);

    // Check validation result
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    // Parse fields from body
    const animalFields = parseAnimalFromBody(req);
    Animal.findOne({
            "tattoo.right": req.body.tattoo.right,
            "tattoo.left": req.body.tattoo.left
        })
        .then(animal => {
            if (animal) {
                res.status(409).json({ message: "An animal with those tattoos already exists" });
            } else {
                // Save the animal
                new Animal(animalFields).save().then(animal => res.json(animal));
            }
        });
});

// @route   POST api/animals/:animal_id/weight
// @desc    Create weight entry for animal
// @access  Private
router.post("/:animal_id/weight", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { error, value } = validateWeightInput(req.body);

    // Check validation result
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    // Parse fields from body
    Weight.findOne({ animal: req.params.animal_id, timestamp_month: req.params.timestamp_month }, { new: true })
        .then(weight => {
            if (weight) {
                // TODO: Update days arrays w/o overriding existing values
                //        overthink how request body should be structured
                res.json(weight);
            } else {
                new Weight(req.body).save().then(weight => res.json(weight));
            }
        });
});

// @route   PUT api/animals/:animal_id
// @desc    Modify animal
// @access  Private
router.put("/:animal_id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { error, value } = validateAnimalInput(req.body, req.method);

    // Check validation result
    if (error !== null) {
        return res.status(400).json(error.details);
    }

    const animalFields = parseAnimalFromBody(req);
    Animal.findOneAndUpdate(req.params.animal_id, animalFields, { new: true })
        .then(animal => {
            if (animal) {
                res.json(animal);
            } else {
                res.status(404).json({ message: "This animal does not exist" });
            }
        });
});

module.exports = router;

parseAnimalFromBody = function(req) {
    const animalFields = {};
    animalFields.user = req.user.id;

    if (req.body.name) animalFields.name = req.body.name;
    if (req.body.sex) animalFields.sex = req.body.sex;
    if (req.body.race) animalFields.race = req.body.race;
    if (req.body.color) animalFields.color = req.body.color;
    if (req.body.dateOfBirth) animalFields.dateOfBirth = req.body.dateOfBirth;
    if (req.body.dateOfDeath) animalFields.dateOfDeath = req.body.dateOfDeath;
    if (req.body.dateOfSlaughter) animalFields.dateOfSlaughter = req.body.dateOfSlaughter;

    if (req.body.tattoo) {
        animalFields.tattoo = {};
        if (req.body.tattoo.right) animalFields.tattoo.right = req.body.tattoo.right;
        if (req.body.tattoo.left) animalFields.tattoo.left = req.body.tattoo.left;
    }

    return animalFields;
}
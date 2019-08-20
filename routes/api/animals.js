const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Load models
const Animal = require("../../models/Animal");
//const Weight = require("../../models/Weight");
//const Litter = require("../../models/Litter");

// Load input validation
const validateAnimalInput = require("../../validation/animal");
//const validateWeightInput = require("../../validation/weight");
//const validateLitterInput = require("../../validation/litter");

// @route   GET api/animals
// @desc    Get all animals for the current user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        let animals = await Animal.find({ user: req.user.id });
        if (animals.length === 0) {
            return res.status(404).json({ message: "No animals found" });
        }
        res.json(animals);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/animals/user/:user_id
// @desc    Get all animals for a specific user
// @access  Private
router.get("/user/:user_id", auth, async (req, res) => {
    try {
        let animals = await Animal.find({ user: req.params.user_id });
        if (!animals) {
            res.status(404).json({ message: "No animals found for the given user" });
        }
        res.json(animals);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/animals/:animal_id
// @desc    Get animal by ID
// @access  Private
router.get("/:animal_id", auth, async (req, res) => {
    try {
        let animal = await Animal.findById(req.params.animal_id);
        if (!animal) {
            res.status(404).json({ message: "No animal found for the given ID" });
        }
        res.json(animal);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   POST api/animals
// @desc    Create animal
// @access  Private
router.post("/", auth, async (req, res) => {
    try {
        const { error, value } = validateAnimalInput(req.body, req.method);
        if (error !== null) {
            return res.status(400).json(error.details);
        }

        const animalFields = parseAnimalFromBody(req);
        if (animalFields.tattoo) {
            let animal = await Animal.findOne({
                "tattoo.right": animalFields.tattoo.right,
                "tattoo.left": animalFields.tattoo.left
            });
            if (animal) {
                return res.status(409).json({ message: "An animal with those tattoos already exists" });
            }
        }
        let animal = await new Animal(animalFields).save();
        res.json(animal);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/animals/:animal_id
// @desc    Modify animal
// @access  Private
router.put("/:animal_id", auth, async (req, res) => {
    try {
        const { error, value } = validateAnimalInput(req.body, req.method);
        if (error !== null) {
            return res.status(400).json(error.details);
        }

        const animalFields = parseAnimalFromBody(req);

        if (animalFields.tattoo) {
            let animal = await Animal.findOne({
                "tattoo.right": animalFields.tattoo.right,
                "tattoo.left": animalFields.tattoo.left
            });
            if (animal) {
                return res.status(409).json({ message: "An animal with those tattoos already exists" });
            }
        }

        let animal = await Animal.findOneAndUpdate(req.params.animal_id, animalFields, { new: true });
        if (animal) {
            res.json(animal);
        } else {
            res.status(404).json({ message: "This animal does not exist" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/animals/:animal_id
// @desc    Delete animal
// @access  Private
router.delete("/:animal_id", auth, async (req, res) => {
    try {
        let animal = await Animal.findById(req.params.animal_id);

        if (!animal) {
            return res.status(404).json({ message: "This animal does not exist" });
        }

        if (animal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await animal.remove();
        res.json({ message: "Animal deleted" });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "This animal does not exist" });
        }
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// #region -- Weight routes removed for now
// @route   GET api/animals/:animal_id/weight[?from=<date>&to=<date>]
// @desc    Get weight data for a specific animal
// @access  Private
// router.get("/:animal_id/weight", auth, (req, res) => {
//     // Filter weight data by date
//     if (req.query.from && req.query.to) {
//         from = (req.query.from) ? new Date(parseInt(req.query.from)) : new Date();
//         to = (req.query.to) ? new Date(parseInt(req.query.to)) : new Date();
//         month_from = new Date(from.getFullYear(), from.getMonth(), 1);
//         month_to = new Date(to.getFullYear(), to.getMonth(), 1);

//         // TODO: User should be able to define range on day depth not only by month timestamp

//         Weight.find({
//                 animal: req.params.animal_id,
//                 timestamp_month: {
//                     $gte: month_from.toISOString(),
//                     $lte: month_to.toISOString()
//                 }
//             })
//             .then(weights => {
//                 if (!weights) {
//                     res.status(404).json({ message: "There is no weight data for the animal with the given ID" });
//                 } else {
//                     res.json(weights);
//                 }
//             })
//             .catch(err => res.status(500).json(err));
//     } else {
//         Weight.find({ animal: req.params.animal_id })
//             .then(weights => {
//                 if (!weights) {
//                     res.status(404).json({ message: "There is no weight data for the animal with the given ID" });
//                 } else {
//                     res.json(weights);
//                 }

//             })
//             .catch(err => res.status(500).json(err));
//     }
// });

// @route   POST api/animals/:animal_id/weight
// @desc    Create weight entry for animal
// @access  Private
// router.post("/:animal_id/weight", auth, (req, res) => {
//     const { error, value } = validateWeightInput(req.body);

//     // Check validation result
//     if (error !== null) {
//         return res.status(400).json(error.details);
//     }

//     // Parse date from body
//     date = new Date(req.body.timestamp);
//     timestamp_month = new Date(date.getFullYear(), date.getMonth(), 1);

//     // Parse fields from body
//     Weight.findOne({ animal: req.params.animal_id, timestamp_month })
//         .then(weight => {
//             if (weight) {
//                 console.log("Tuple for month " + date.getMonth() + " already exists");
//                 Weight.findOne({ 'days.index': date.getDate() })
//                     .then(weightWithDate => {
//                         if (weightWithDate) {
//                             console.log("Found tuple with date index of: " + date.getDate());
//                             // Array not guaranteed to be sorted
//                             dayIndex = weightWithDate.days.findIndex(day => day.index === date.getDate());
//                             weightWithDate.days[dayIndex].weight = req.body.weight;
//                             weightWithDate.save()
//                                 .then(res.json(weightWithDate))
//                                 .catch(err => res.json(err));
//                         } else {
//                             console.log("No tuple with date index of: " + date.getDate() + ", pushing weight");
//                             weight.days.push({
//                                 index: date.getDate(),
//                                 weight: req.body.weight
//                             });
//                             weight.save()
//                                 .then(weight => res.json(weight));
//                         }
//                     });
//             } else {
//                 const newWeight = new Weight({
//                     animal: req.params.animal_id,
//                     timestamp_month,
//                 });
//                 newWeight.days.push({
//                     index: date.getDate(),
//                     weight: req.body.weight
//                 });
//                 newWeight.save()
//                     .then(weight => res.json(weight));
//             }
//         })
//         .catch(err => res.status(500).json(err));
// });
// #endregion 

// #region -- Litter route removed for now
// @route   POST api/animals/:animal_id/litters
// @desc    Create litter entry for animal
// @access  Private
// router.post("/:animal_id/litters", auth, (req, res) => {
//     Animal.findOne({ animal: req.params.animal_id })
//         .then(animal => {
//             if (!animal) {
//                 return res.status(404).json({ message: "There is no animal with the given ID" });
//             } else {
//                 if (animal.sex !== "0,1") {
//                     return res.status(400).json({ message: "Cannot add litter for male animal" });
//                 } else {
//                     const { error, value } = validateLitterInput(req.body);

//                     // Check validation result
//                     if (error !== null) {
//                         return res.status(400).json(error.details);
//                     }

//                     // TODO: Probably should check if buck is a male animal...
//                     Litter.findOne({ doe: req.params.animal_id })
//                         .then(doe => {
//                             if (doe) {
//                                 doe.litter.push({
//                                     buck: req.body.buck,
//                                     dateOfMating: req.body.dateOfMating,
//                                     dateOfRemating: req.body.dateOfRemating,
//                                     dateOfKindle: req.body.dateOfKindle,
//                                     litterSize: req.body.litterSize
//                                 })
//                                 doe.save()
//                                     .then(doe => res.json(doe));
//                             } else {
//                                 const newDoe = new Litter({
//                                     doe: req.params.animal_id,
//                                 });
//                                 newDoe.litter.push({
//                                     buck: req.body.buck,
//                                     dateOfMating: req.body.dateOfMating,
//                                     dateOfRemating: req.body.dateOfRemating,
//                                     dateOfKindle: req.body.dateOfKindle,
//                                     litterSize: req.body.litterSize
//                                 });
//                                 newDoe.save()
//                                     .then(newDoe => res.json(newDoe));
//                             }
//                         })

//                 }
//             }
//         })
//         .catch(err => res.status(500).json(err));
// });
// #endregion -- Weight routes removed for now

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
    if (req.body.mother) animalFields.mother = req.body.mother;
    if (req.body.father) animalFields.father = req.body.father;

    if (req.body.tattoo) {
        animalFields.tattoo = {};
        if (req.body.tattoo.right) animalFields.tattoo.right = req.body.tattoo.right;
        if (req.body.tattoo.left) animalFields.tattoo.left = req.body.tattoo.left;
    }

    return animalFields;
}
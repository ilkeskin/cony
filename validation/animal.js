const Joi = require("joi");

const tattoo = Joi.object().keys({
    // ^ asserts position at start of a line
    // Match a single character present in the list below [A-Z]{1,2}
    // {1,2} Quantifier — Matches between 1 and 2 times, as many times as possible, giving back as needed
    // Match a single character present in the list below [J]?
    // ? Quantifier — Matches between zero and one times, as many times as possible, giving back as needed
    // Match a single character present in the list below [0-9]{1,3}
    // {1,3} Quantifier — Matches between 1 and 3 times, as many times as possible, giving back as needed
    // $ asserts position at the end of a line
    right: Joi.string().trim().regex(/^[A-Z]{1,2}[J]?[0-9]{1,3}$/).required(),
    left: Joi.number().integer().positive().max(99999).required(),
});

const schema = Joi.object().keys({
    name: Joi.string().trim().min(3).max(30),
    sex: Joi.string().trim().valid("0,1", "1,0"),
    race: Joi.string().trim().min(3).max(50),
    color: Joi.string().trim().min(3).max(50),
    dateOfBirth: Joi.date().max(Joi.ref("dateOfDeath")),
    dateOfDeath: Joi.date().min(Joi.ref("dateOfBirth")),
    dateOfSlaughter: Joi.date().min(Joi.ref("dateOfDeath")),
    tattoo,
});

const onAnimalCreationSchema = schema.requiredKeys("name", "sex");

module.exports = function validateAnimalInput(data, method) {
    let result;
    if (method === "POST") {
        result = Joi.validate(data, onAnimalCreationSchema, { abortEarly: false });
    } else if (method === "PUT") {
        result = Joi.validate(data, schema, { abortEarly: false });
    }
    return result;
};
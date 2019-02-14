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
  name: Joi.string().min(3).max(30).required(),
  sex: Joi.string().valid("0,1", "1,0").required(),
  race: Joi.string().min(3).max(50),
  color: Joi.string().min(3).max(50),
  dateOfBirth: Joi.date().max(Joi.ref("dateOfDeath")),
  dateOfDeath: Joi.date().min(Joi.ref("dateOfBirth")),
  dateOfSlaughter: Joi.date().min(Joi.ref("dateOfDeath")),
  tattoo,
});

module.exports = function validateAnimalInput(data) {
  const result = Joi.validate(data, schema, {
    abortEarly: false
  });
  return result;
};
const Joi = require("joi");

const schema = Joi.object().keys({
  timestamp_month: Joi.date().required(),
  days: Joi.array().max(31).items(Joi.number().min(0.0).max(20.0)),
});

module.exports = function validateWeightInput(data) {
  const result = Joi.validate(data, schema, {
    abortEarly: false
  });
  return result;
};
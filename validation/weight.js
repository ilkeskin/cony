const Joi = require("joi");

const schema = Joi.object().keys({
    timestamp: Joi.date().required(),
    weight: Joi.number().min(0.0).max(20.0)
});

module.exports = function validateWeightInput(data) {
    const result = Joi.validate(data, schema, { abortEarly: false });
    return result;
};
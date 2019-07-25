const Joi = require("joi");

const schema = Joi.object().keys({
    dateOfMating: Joi.date().required(),
    dateOfRemating: Joi.date().min(Joi.ref('dateOfMating')).required(),
    dateOfLitter: Joi.date().min(Joi.ref('dateOfMating')).required(),
    litterSize: Joi.number().min(0).max(20).integer().required()
});

module.exports = function validateLitterInput(data) {
    const result = Joi.validate(data, schema, { abortEarly: false });
    return result;
};
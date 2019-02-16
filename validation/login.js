const Joi = require("joi");

const schema = Joi.object().keys({
    // must have two domain parts e.g. example.com
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required()
});

module.exports = function validateLoginInput(data) {
    const result = Joi.validate(data, schema, { abortEarly: false });
    return result;
};
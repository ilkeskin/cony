const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2
};

const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    // must have two domain parts e.g. example.com
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: new PasswordComplexity(complexityOptions)
});

module.exports = function validateRegisterInput(data) {
    const result = Joi.validate(data, schema, { abortEarly: false });
    return result;
};
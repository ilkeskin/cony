const Joi = require("joi");
const customJoi = Joi.extend(require("joi-phone-number"));

const address = customJoi.object().keys({
    street: customJoi.string().min(2).max(40),
    city: customJoi.string().min(2).max(50),
    state: customJoi.string().min(2).max(30),
    zip: customJoi.number()
});

const social = customJoi.object().keys({
    telephone: customJoi.string().phoneNumber(),
    website: customJoi.string().uri(),
    facebook: customJoi.string().uri(),
    youtube: customJoi.string().uri(),
    twitter: customJoi.string().uri(),
    instagram: customJoi.string().uri()
});

const schema = customJoi.object().keys({
    handle: customJoi.string().min(2).max(40).default(""),
    gender: customJoi.string().valid("male", "female", "diverse"),
    country: customJoi.string().min(2).max(40),
    club: customJoi.string().min(2).max(40).default(""),
    address,
    social
});

const onProfileCreationSchema = schema.requiredKeys(
    "handle",
    "address.street",
    "address.city",
    "address.state",
    "address.zip"
);

module.exports = function validateProfileInput(data, method) {
    let result;
    if (method === "POST") {
        result = customJoi.validate(data, onProfileCreationSchema, { abortEarly: false });
    } else if (method === "PUT") {
        result = customJoi.validate(data, schema, { abortEarly: false });
    }
    return result;
};
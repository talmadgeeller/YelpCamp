const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

// Matches the validation rules in Athena-Web/schemas.js userSchema, since
// both apps create accounts in the same shared talmadge-tech.users
// collection and must enforce the same username/email/password invariants.
module.exports.userSchema = Joi.object({
    username: Joi.string().required().escapeHTML().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).message('Username can only contain letters, numbers, and underscores.'),
    email: Joi.string().email().max(254).required(),
    password: Joi.string().min(4).max(128).required()
});
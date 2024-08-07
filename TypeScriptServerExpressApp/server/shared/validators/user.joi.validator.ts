import Joi from 'joi';
export const createUserValidationSchema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()/*.pattern(new RegExp('...'))*/.required(),
    repeat_password: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords must match'
    }),
    email: Joi.string().email({
        minDomainSegments: 2, // the minimum number of domain segments (e.g. x.y.z has 3 segments)
        tlds: { allow: ['com', 'net'] }, // allowed domains
    }).required(),
});

// Update User is similar to Create User, but the fields are optional
export const updateUserValidationSchema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).optional(),
    last_name: Joi.string().alphanum().min(3).max(30).optional()
});

export const changePasswordValidationSchema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    repeat_password: Joi.any().valid(Joi.ref('new_password')).required().messages({
        'any.only': 'Passwords must match'
    })
});

// MongoDB Object_ID Validator
export const getUserIdValidationSchema = Joi.object({
    id: Joi.string().hex().length(24)
});
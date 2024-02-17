import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: Joi.string().required(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: Joi.string().required(),
})
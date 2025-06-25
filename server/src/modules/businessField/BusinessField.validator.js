import Joi from "joi";

export const createBusinessField = Joi.object({
    name: Joi.string().required(),
});

export const updateBusinessField = Joi.object({
    name: Joi.string().required(),
});

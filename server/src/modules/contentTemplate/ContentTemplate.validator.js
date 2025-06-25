import Joi from "joi";

export const createConTemplate = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
});

export const updateConTemplate = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    userId: Joi.number().integer().optional(),
    aiModelId: Joi.number().integer().optional(),
});

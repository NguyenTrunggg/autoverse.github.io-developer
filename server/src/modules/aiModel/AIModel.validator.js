import Joi from "joi";

export const createAIModel = Joi.object({
    name: Joi.string().required(),
    apiKey: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateAIModel = Joi.object({
    name: Joi.string().required(),
    apiKey: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateAIModelStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

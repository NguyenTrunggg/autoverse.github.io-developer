import Joi from "joi";

export const createAssigned = Joi.object({
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
});

export const updateAssigned = Joi.object({
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
});

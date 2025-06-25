import Joi from "joi";

export const createCustomerDataset = Joi.object({
    name: Joi.string().required(),
    sourceType: Joi.string().required(),
    sourcePath: Joi.string().required(),
    fileType: Joi.string().required(),
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
});

export const updateCustomerDataset = Joi.object({
    name: Joi.string().required(),
    sourceType: Joi.string().required(),
    sourcePath: Joi.string().required(),
    fileType: Joi.string().required(),
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
    statusId: Joi.number().integer().required(),
});

export const updateCustomerDatasetStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

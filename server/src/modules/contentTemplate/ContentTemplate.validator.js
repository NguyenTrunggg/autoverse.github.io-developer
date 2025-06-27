import Joi from "joi";

export const createConTemplate = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    userId: Joi.number().integer().required(),
    aiModelId: Joi.number().integer().required(),
});

export const updateConTemplate = Joi.object({
    title: Joi.string().allow("").optional(),
    body: Joi.string().allow("").optional(),
    userId: Joi.number().integer().optional(),
    aiModelId: Joi.number().integer().optional(),
    // imageBody: Joi.array().items(Joi.string()).optional(),
    // imageBody: Joi.alternatives()
    //     .try(
    //         Joi.array().items(Joi.string()),
    //         Joi.string() // để accept JSON.stringify mảng trong form-data
    //     )
    //     .optional(),
}).unknown();

import Joi from "joi";

export const createPostSchema = Joi.object({
    userId: Joi.number().integer().required(),
    templateId: Joi.number().integer().required(),
    channelId: Joi.number().integer().required(),
    socialIntegrationId: Joi.number().integer().required(),
    statusId: Joi.number().integer().required(),
    scheduledDate: Joi.date().iso().required(), // Expect format: YYYY-MM-DD
    scheduledHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .required(), // Expect format: HH:mm:ss
});

export const updatePostSchema = Joi.object({
    templateId: Joi.number().integer().optional(),
    channelId: Joi.number().integer().optional(),
    socialIntegrationId: Joi.number().integer().optional(),
    statusId: Joi.number().integer().optional(),
    scheduledDate: Joi.date().iso().optional(),
    scheduledHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .optional(),
});

export const updatePostStatusSchema = Joi.object({
    statusId: Joi.number().integer().required(),
});

import Joi from "joi";

export const createUserPromotion = Joi.object({
    userId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    aiModelId: Joi.number().integer().required(),
    note: Joi.string().optional(),
});

export const updateUserPromotion = Joi.object({
    userId: Joi.number().integer().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    aiModelId: Joi.number().integer().required(),
    note: Joi.string().optional(),
});

export const createPromotionUsage = Joi.object({
    userId: Joi.number().integer().required(),
    promotionId: Joi.number().integer().required(),
    serviceType: Joi.string().required(),
    usageDate: Joi.date().iso().required(),
    count: Joi.number().integer().required(),
});

export const updatePromotionUsage = Joi.object({
    userId: Joi.number().integer().required(),
    promotionId: Joi.number().integer().required(),
    serviceType: Joi.string().required(),
    usageDate: Joi.date().iso().required(),
    count: Joi.number().integer().required(),
});

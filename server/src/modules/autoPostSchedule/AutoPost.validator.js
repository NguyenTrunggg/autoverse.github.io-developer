import Joi from "joi";

export const create = Joi.object({
    userId: Joi.number().integer().required(),
    channelId: Joi.number().integer().required(),
    businessFieldName: Joi.string().required(),
    postsPerDay: Joi.number().integer().min(1).required(),
    postTimes: Joi.array()
        .items(
            Joi.object({
                time: Joi.string()
                    .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                    .required(),
            })
        )
        .min(1)
        .required(),
    numberOfDays: Joi.number().integer().min(1).required(),
    postDates: Joi.array()
        .items(
            Joi.object({
                date: Joi.date().iso().required(),
            })
        )
        .min(1)
        .required(),
    keywords: Joi.array().items(Joi.string()).required(),
    mediaUrl: Joi.string().uri().optional(),
    channelId: Joi.number().integer().optional(),
    socialInteId: Joi.number().integer().required(),
});

export const createPlanExcel = Joi.object({
    postsPerDay: Joi.number().integer().min(1).required(),
    postTimes: Joi.array()
        .items(
            Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
                .required()
        )
        .min(1)
        .required(),
    numberOfDays: Joi.number().integer().min(1).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    businessFieldName: Joi.string().required(),
    driveLink: Joi.string().uri().allow("", null).optional(),
});

export const createScheduleByExcel = Joi.object({
    userId: Joi.number().integer().required(),
    channelId: Joi.number().integer().required(),
    businessFieldName: Joi.string().required(),
    mediaUrl: Joi.string().uri().allow("", null).optional(),
    socialInteId: Joi.number().integer().required(),
});

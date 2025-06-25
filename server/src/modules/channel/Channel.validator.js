import Joi from "joi";

export const createChannel = Joi.object({
    apiEndpoint: Joi.string().required(),
    channelTypeId: Joi.number().integer().required(),
    statusId: Joi.number().integer().required(),
});

export const updateChannel = Joi.object({
    apiEndpoint: Joi.string().required(),
    channelTypeId: Joi.number().integer().required(),
    statusId: Joi.number().integer().required(),
});

export const updateChannelStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

export const createChannelType = Joi.object({
    name: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateChannelType = Joi.object({
    name: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateChannelTypeStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

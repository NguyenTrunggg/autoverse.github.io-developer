import Joi from "joi";

export const createPayment = Joi.object({
    userId: Joi.number().integer().required(),
    paymentMethodId: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    transactionId: Joi.string().required(),
});

export const updatePayment = Joi.object({
    userId: Joi.number().integer().required(),
    paymentMethodId: Joi.number().integer().required(),
    amount: Joi.number().integer().required(),
    transactionId: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updatePaymentStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

export const createGateway = Joi.object({
    name: Joi.string().required(),
    apiUrl: Joi.string().required(),
    callbackUrl: Joi.string().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateGateway = Joi.object({
    name: Joi.string().required(),
    apiUrl: Joi.string().required(),
    callbackUrl: Joi.string().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateGatewayStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

export const createMethodPay = Joi.object({
    name: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateMethodPay = Joi.object({
    name: Joi.string().required(),
    statusId: Joi.number().integer().required(),
});

export const updateMethodPayStatus = Joi.object({
    statusId: Joi.number().integer().required(),
});

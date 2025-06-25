import Joi from "joi";

export const handleLogin = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const handleRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(), // <-- validate email chuẩn
    phone: Joi.string().required(),
    address: Joi.string().required(),
    password: Joi.string().min(6).required(), // <-- kiểm tra độ dài
});

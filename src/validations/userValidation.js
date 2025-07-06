import Joi from 'joi';


export const registerValidation = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,20}$/)
    .required(),
});

export const loginValidation =Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,20}$/)
})

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(), 
});
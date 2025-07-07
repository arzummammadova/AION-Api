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

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Düzgün email formatı daxil edin.',
    'string.empty': 'Email sahəsi boş buraxıla bilməz.',
    'any.required': 'Email sahəsi tələb olunur.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifrə ən azı 6 simvol olmalıdır.',
    'string.empty': 'Şifrə sahəsi boş buraxıla bilməz.',
    'any.required': 'Şifrə sahəsi tələb olunur.'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Şifrə təsdiqi şifrə ilə eyni olmalıdır.',
    'string.empty': 'Şifrə təsdiqi sahəsi boş buraxıla bilməz.',
    'any.required': 'Şifrə təsdiqi sahəsi tələb olunur.'
  })
});

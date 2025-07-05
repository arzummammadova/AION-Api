// // src/validations/userValidation.js
import Joi from 'joi';

// export const registerValidation = Joi.object({
//   username: Joi.string().min(3).max(20).required().messages({
//     'string.empty': 'İstifadəçi adı boş ola bilməz',
//     'string.min': 'İstifadəçi adı ən azı 3 simvol olmalıdır',
//     'string.max': 'İstifadəçi adı maksimum 20 simvol ola bilər',
//   }),
//   email: Joi.string().email().required().messages({
//     'string.empty': 'Email boş ola bilməz',
//     'string.email': 'Zəhmət olmasa düzgün email daxil edin',
//   }),
//   password: Joi.string()
//   .min(8)
//   .max(20)
//   .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|:;"\'<>,.?/~`]).*$'))
//   .required()
//   .messages({
//     'string.empty': 'Şifrə boş ola bilməz',
//     'string.min': 'Şifrə ən azı 8 simvol olmalıdır',
//     'string.max': 'Şifrə maksimum 20 simvol ola bilər',
//     'string.pattern.base': 'Şifrə ən azı 1 böyük hərf, 1 rəqəm və 1 xüsusi simvol içerməlidir',
//   }),

// });

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
const Joi = require('joi');

const registerDto = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(50).required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
    }),
});

module.exports = registerDto;
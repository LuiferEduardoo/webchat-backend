const Joi = require('joi');

const createGroupDto = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(200),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
}).messages({
  'string.pattern.base': 'El ID debe ser un string hexadecimal de 24 caracteres',
});

const updateGroupDto = Joi.object({
  name: Joi.string().min(3).max(50),
  description: Joi.string().max(200),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
}).messages({
  'string.pattern.base': 'El ID debe ser un string hexadecimal de 24 caracteres',
});

const deleteGroupDto = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
}).messages({
  'string.pattern.base': 'El ID debe ser un string hexadecimal de 24 caracteres',
});

module.exports = {
  createGroupDto,
  updateGroupDto,
  deleteGroupDto,
};
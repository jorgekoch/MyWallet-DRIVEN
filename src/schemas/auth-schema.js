import joi from 'joi';

export const usuarioSchema = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().min(6).required(),
  senhaConfirmacao: joi.string().valid(joi.ref('senha')).required()
});

export const sessaoSchema = joi.object({
  email: joi.string().email().required(),
  senha: joi.string().required(),
});
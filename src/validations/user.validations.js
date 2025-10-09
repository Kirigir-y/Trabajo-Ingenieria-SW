"use strict";
import Joi from "joi";

export const profileQueryValidation = Joi.object({

    id_user: Joi.number()
    .integer()
    .positive()
    .messages({
        "number.base": "El ID es un número",
        "number.integer": "El ID es un numero entero",
        "number.positive": "El ID es un número positivo"
    }) 
});


export const authBodyValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El correo electrónico debe ser válido.",
      "any.required": "El correo es necesario",
      "string.empty": "El correo electrónico es obligatorio.",
    }),
  password: Joi.string().min(8).max(26).required().messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
    "string.max": "La contraseña debe tener como máximo 26 caracteres.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
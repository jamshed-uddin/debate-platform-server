const joi = require("joi");

const validateUserInfo = (userInfo) => {
  const schema = joi.object({
    name: joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is required",
    }),
    email: joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),

    password: joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.length": "Password length must be 6 digit",
      "string.empty": "Password is required",
    }),
    provider: joi.string().valid("google", "credentials").required().messages({
      "any.required": "Provider is required",
      "string.empty": "Provider is required",
      "any.only": "Provider must be either 'google' or 'credentials'",
    }),
  });
  return schema.validate(userInfo);
};
const validateUserCredentials = (credentials) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),

    password: joi.string().min(6).required().messages({
      "any.required": "Password is required",
      "string.length": "Password length must be 6 digit",
      "string.empty": "Password is required",
    }),
  });
  return schema.validate(credentials);
};

const validateDebateInfo = (debateInfo) => {
  const schema = joi.object({
    title: joi.string().required().messages({
      "any.required": "Title is required",
      "string.empty": "Title is required",
    }),

    description: joi.string().allow("").messages({
      "string.base": "Description must be a string",
    }),

    category: joi.string().required().messages({
      "any.required": "Category is required",
      "string.empty": "Category is required",
    }),

    banner: joi.string().uri().allow("").messages({
      "string.uri": "Banner must be a valid URL",
    }),

    duration: joi.number().required().min(3600000).messages({
      "any.required": "Duration is required",
      "number.base": "Duration must be a number (in ms)",
      "number.min": "Duration must be at least 1 hour (in ms)",
    }),

    tags: joi.array().items(joi.string()).default([]).messages({
      "array.base": "Tags must be an array of strings",
    }),
  });

  return schema.validate(debateInfo);
};

module.exports = {
  validateUserInfo,
  validateUserCredentials,
  validateDebateInfo,
};

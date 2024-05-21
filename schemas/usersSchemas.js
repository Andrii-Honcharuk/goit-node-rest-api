import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  subscription: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  subscription: Joi.string(),
})
  .min(1)
  .message({ "object.min": "Body must have at least one field" });

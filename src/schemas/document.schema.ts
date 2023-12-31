import Joi from "joi";

export const DocumentSchema = {
  createDocument: Joi.object({
    title: Joi.string().min(2).max(30).required(),
    content: Joi.string().min(2).max(2048).required(),
    userId: Joi.number().required(),
    state: Joi.string().required().valid("draft", "published"),
  }),

  updateDocument: Joi.object({
    title: Joi.string().min(2).max(30).allow("").optional(),
    content: Joi.string().min(2).max(2048).allow("").optional(),
    userId: Joi.number().required(),
    state: Joi.string().required().valid("draft", "published"),
  }),
};

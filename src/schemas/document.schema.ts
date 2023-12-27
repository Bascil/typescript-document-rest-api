import Joi from "joi";

export const DocumentSchema = {
  createDocument: Joi.object({
    title: Joi.string().min(2).max(20).required(),
    content: Joi.string().min(2).max(20).required(),
    creatorId: Joi.number().required(),
  }),

  updateDocument: Joi.object({
    title: Joi.string().min(2).max(20).allow("").optional(),
    content: Joi.string().min(2).max(20).allow("").optional(),
    creatorId: Joi.number().allow("").optional(),
  }),
};

import { Schema, model } from "mongoose";
import Joi from "joi";
import { middlewares } from "../middleware/index.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", middlewares.mongooseError);

export const Contact = model("contact", contactSchema);

 const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({ "any.required": "Missing required name field" }),
  email: Joi.string().email().required().messages({ "any.required": "Missing required name field" }),
  phone: Joi.string().required().messages({ "any.required": "Missing required name field" }),
  favorite: Joi.boolean(),
});

 const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

 const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "Missing required favorite field",
  }),
});

export const schemas = {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema
}
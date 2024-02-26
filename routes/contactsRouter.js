import express from "express";
import contactsControllers from '../controllers/contactsControllers.js'
import { middlewares } from "../middleware/index.js";
import { schemas } from "../models/contact.js";

const {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  updateFavorite,
  deleteContact
} = contactsControllers

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", middlewares.isValidId, getOneContact);

contactsRouter.delete("/:id", middlewares.isValidId, deleteContact);

contactsRouter.post("/", middlewares.validateBody(schemas.createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", middlewares.isValidId, middlewares.validateBody(schemas.updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", middlewares.isValidId, middlewares.validateBody(schemas.updateContactSchema), updateContact);

export default contactsRouter;
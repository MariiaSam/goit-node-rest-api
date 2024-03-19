import express from "express";
import contactsControllers from '../controllers/contactsControllers.js'
import { authenticate, isValidId, validateBody } from "../middleware/index.js";
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

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(schemas.createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", authenticate, isValidId, validateBody(schemas.updateContactSchema), updateContact);

export default contactsRouter;

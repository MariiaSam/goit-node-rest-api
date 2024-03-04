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

contactsRouter.get("/", middlewares.authenticate, getAllContacts);

contactsRouter.get("/:id",  middlewares.authenticate, middlewares.isValidId, getOneContact);

contactsRouter.delete("/:id", middlewares.authenticate, middlewares.isValidId, deleteContact);

contactsRouter.post("/", middlewares.authenticate, middlewares.isValidId,  middlewares.validateBody(schemas.createContactSchema), createContact);

contactsRouter.patch("/:id/favorite", middlewares.authenticate, middlewares.isValidId, middlewares.validateBody(schemas.updateFavoriteSchema), updateFavorite);

contactsRouter.put("/:id", middlewares.authenticate, middlewares.isValidId, middlewares.validateBody(schemas.updateContactSchema), updateContact);

export default contactsRouter;
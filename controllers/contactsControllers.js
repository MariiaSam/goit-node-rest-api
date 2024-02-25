import { Contact } from "../models/contact.js";
import wrapper from "../helpers/wrapper.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = wrapper(async (req, res) => {
  const allContacts = await Contact.find();
  res.json(allContacts);
});

export const getOneContact =  wrapper (async (req, res) => {
  const { id } = req.params;
  const contactById = await Contact.findById(id);
  if (!contactById) {
    throw HttpError(404, "Not found");
  }
  res.json(contactById);
});

export const createContact = wrapper (async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
});

export const updateContact = wrapper (async (req, res) => {
  const { id } = req.params;
  const resultUpdate = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(resultUpdate);
});

export const updateFavorite = wrapper(async (req, res) => {
  const { id } = req.params;
  const resultFavorite = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!resultFavorite) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(resultFavorite);
});

export const deleteContact = wrapper (async (req, res) => {
  const { id } = req.params;
  const resultDelete = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(resultDelete);
});

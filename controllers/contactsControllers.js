import { Contact } from "../models/contact.js";
import wrapper from "../helpers/wrapper.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (_, res) => {
  const resultAllContacts = await Contact.find();
  res.json(resultAllContacts);
};

const getOneContact =  async (req, res) => {
  const { id } = req.params;
  const resultContactById = await Contact.findById(id);

  if (!resultContactById) {
    throw HttpError(404, "Not found");
  }
  res.json(resultContactById);
};

const createContact = async (req, res) => {
  const resultNewContact = await Contact.create(req.body);
  res.status(201).json(resultNewContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const resultUpdate = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!resultUpdate) {
    throw HttpError(404, "Not found");
  }
  res.json(resultUpdate);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const resultFavorite = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!resultFavorite) {
    throw HttpError(404, "Not found");
  }
  res.json(resultFavorite);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const resultDelete = await Contact.findByIdAndDelete(id);

  if (!resultDelete) {
    throw HttpError(404, "Not found");
  }
  res.json(resultDelete);
};

export default {
  getAllContacts: wrapper(getAllContacts),
  getOneContact: wrapper(getOneContact),
  createContact: wrapper(createContact),
  updateContact: wrapper(updateContact),
  updateFavorite: wrapper(updateFavorite),
  deleteContact: wrapper(deleteContact)
}
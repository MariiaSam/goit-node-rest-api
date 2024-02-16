import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";


export const getAllContacts =  ctrlWrapper(async (_, res) => {
    const result = await listContacts();
    res.status(200).json(result);
  });
  

export const getContactById = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
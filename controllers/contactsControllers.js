import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/errorWrapper.js";

import { isValidObjectId } from "mongoose";
import {
  addContact,
  getAllContacts,
  getOneContactById,
  removeContactById,
  updateContactById,
  updateFavoriteStatusContact,
} from "../services/contactsServices.js";

export const getAllContactsController = errorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const contacts = await getAllContacts(userId);
  res.status(200).json(contacts);
});

export const getOneContactByIdController = errorWrapper(
  async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw HttpError(400, `${id} is not a valid id`);

    const userId = req.user.id;
    const contact = await getOneContactById(id, userId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw HttpError(404, "Not found");
    }
  }
);

export const deleteContactController = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw HttpError(400, `${id} is not a valid id`);
  }
  const userId = req.user.id;
  const contact = await removeContactById(id, userId);
  if (contact) {
    res.status(200).json(contact);
  } else {
    throw HttpError(404, "Not found");
  }
});

export const createContactController = errorWrapper(async (req, res, next) => {
  const { name, email, phone } = req.body;

  const userId = req.user.id;
  const contact = await addContact(name, email, phone, userId);

  res.status(201).json({ contact });
});

export const updateContactController = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw HttpError(400, `${id} is not a valid id`);
  }

  const userId = req.user.id;
  const updContact = await updateContactById(id, userId, req.body);
  if (!updContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(updContact);
});

export const updateStatusContactByIdController = errorWrapper(
  async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }
    const userId = req.user.id;
    const updStatusContact = await updateFavoriteStatusContact(
      id,
      userId,
      req.body.favorite
    );
    if (!updStatusContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updStatusContact);
  }
);

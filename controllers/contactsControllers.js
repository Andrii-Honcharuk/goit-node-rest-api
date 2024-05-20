import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/errorWrapper.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

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
  try {
    const userId = req.user.id;
    const contacts = await getAllContacts(userId);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

export const getOneContactByIdController = errorWrapper(
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) throw HttpError(400, `${id} is not a valid id`);

      const userId = req.user.id;
      const contact = await getOneContactById(id, userId);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export const deleteContactController = errorWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }
    const userId = req.user.id;
    const contact = await removeContactById(id, userId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

export const createContactController = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const { error } = createContactSchema.validate({ name, email, phone });

    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const userId = req.user.id;
    const contact = await addContact(name, email, phone, userId);

    res.status(201).json({ contact });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = errorWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }

    const userId = req.user.id;
    const updContact = await updateContactById(id, userId, req.body);
    if (!updContact) {
      return res.status(404).json({ message: "Not found" });
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json(updContact);
  } catch (error) {
    next(error);
  }
});

export const updateStatusContactByIdController = errorWrapper(
  async (req, res, next) => {
    try {
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
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(updStatusContact);
    } catch (error) {
      next(error);
    }
  }
);

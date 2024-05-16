import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
  updateFavoriteContact,
} from "../services/contactsServices.js";
import { isValidObjectId } from "mongoose";

export const getAllContacts = async (req, res, next) => {
  console.log({ user: req.user });
  try {
    const contact = await listContacts();
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log("isValidObjectId(id)", isValidObjectId(id));
    if (!isValidObjectId(id)) {
      // res.status(404).send({ message: "Not found" });
      throw HttpError(400, `${id} is not a valid id`);
    }
    const contact = await getContactById(req.params.id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }

    const contact = await removeContact(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate({
    name,
    email,
    phone,
  });
  if (typeof error !== "undefined") {
    return res.status(400).json({ message: error.message });
  }
  try {
    const contact = await addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
    const updContact = await updateContactById(req.params.id, req.body);
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
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, `${id} is not a valid id`);
    }

    const updStatusContact = await updateFavoriteContact(id, req.body.favorite);
    if (!updStatusContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updStatusContact);
  } catch (error) {
    next(error);
  }
};

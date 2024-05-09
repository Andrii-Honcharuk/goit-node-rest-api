import HttpError from "../helpers/HttpError.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contact = await listContacts();
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const contact = await getContactById(req.params.id);
  try {
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

/* DELETE /api/contacts/:id
Викликає функцію-сервіс removeContact для роботи з json-файлом contacts.json

Якщо контакт за id знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом 200

Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404*/

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  try {
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
    const updContact = await updateContactById(req.params.id, req.body);
    if (!updateContactById) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updContact);
  } catch (error) {
    next(error);
  }
};

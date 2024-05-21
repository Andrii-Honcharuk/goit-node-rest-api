import HttpError from "../helpers/HttpError.js";
import contactsRepository from "../repositories/contactsRepository.js";

export const getAllContacts = async (userId) =>
  await contactsRepository.listContacts(userId);

export const getOneContactById = async (id, userId) => {
  const contact = await contactsRepository.getContactById(id, userId);
  if (!contact) {
    throw HttpError(404, "Contact not found");
  }
  return contact;
};

export const removeContactById = async (id, userId) =>
  await contactsRepository.removeContact(id, userId);

export const addContact = async (name, email, phone, userId) =>
  await contactsRepository.addContact(name, email, phone, userId);

export const updateContactById = async (id, userId, data) =>
  await contactsRepository.updateContactById(id, userId, data);

export const updateFavoriteStatusContact = async (id, userId, status) =>
  await contactsRepository.updateFavoriteContactById(id, userId, status);

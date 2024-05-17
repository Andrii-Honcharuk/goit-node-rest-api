import Contact from "../db/models/contact.js";

export const listContacts = () => Contact.find();

export const getContactById = (id) => Contact.findOne({ _id: id });

export const removeContact = (id) => Contact.findOneAndDelete({ _id: id });

export const addContact = (name, email, phone) =>
  Contact.create({ name, email, phone });

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate({ _id: id }, data, { new: true });

export const updateFavoriteContact = (id, status) =>
  Contact.findByIdAndUpdate(id, { favorite: status }, { new: true });

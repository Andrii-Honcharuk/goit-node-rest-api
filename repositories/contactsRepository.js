import Contact from "../db/models/contact.js";

const listContacts = (userId) => Contact.find({ owner: userId });

const getContactById = (id, userId) =>
  Contact.findOne({ _id: id, owner: userId });

const removeContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, owner: userId });

const addContact = (name, email, phone, userId) =>
  Contact.create({ name, email, phone, owner: userId });

const updateContactById = (id, userId, data) =>
  Contact.findByIdAndUpdate({ _id: id, owner: userId }, data, { new: true });

const updateFavoriteContactById = (id, userId, status) =>
  Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { favorite: status },
    { new: true }
  );

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContactById,
  updateFavoriteContactById,
};

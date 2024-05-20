import Contact from "../db/models/contact.js"; // Імпортуємо модель Contact з бази даних

// // Отримуємо всі контакти з бази даних
const listContacts = (userId) => Contact.find({ owner: userId });

// // Отримуємо контакт за його ID
const getContactById = (id, userId) =>
  Contact.findOne({ _id: id, owner: userId });

// // Видаляємо контакт за його ID
const removeContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, owner: userId });

// // Додаємо новий контакт до бази даних
const addContact = (name, email, phone, userId) =>
  Contact.create({ name, email, phone, owner: userId });

// Оновлюємо контакт за  ID
const updateContactById = (id, userId, data) =>
  Contact.findByIdAndUpdate({ _id: id, owner: userId }, data, { new: true });

// // Оновлюємо статус "favorite"  за  ID
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

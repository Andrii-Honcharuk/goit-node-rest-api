import Contact from "../db/models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = (id) => Contact.findOne({ _id: id });

// import path from "path";
// import { nanoid } from "nanoid";
// import * as fs from "fs/promises";

// const contactsPath = path.resolve("db", "contacts.json");

// export async function listContacts() {
//   try {
//     const contacts = await fs.readFile(contactsPath, "utf-8");
//     return JSON.parse(contacts);
//   } catch (error) {
//     console.error("Error reading", error);
//     throw error;
//   }
// }

// export async function getContactById(contactId) {
//   try {
//     const contacts = await listContacts();
//     const contact = contacts.find((contact) => contact.id === contactId);
//     return contact || null;
//   } catch (error) {
//     console.error("Error getting by ID", error);
//     throw error;
//   }
// }
export const removeContact = (id) => Contact.findOneAndDelete({ _id: id });

// export async function removeContact(contactId) {
//   try {
//     const contacts = await listContacts();
//     const index = contacts.findIndex((item) => item.id === contactId);
//     if (index === -1) {
//       return null;
//     }
//     const [result] = contacts.splice(index, 1);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return result;
//   } catch (error) {
//     console.error("Error removing", error);
//     throw error;
//   }
// }

export const addContact = (name, email, phone) =>
  Contact.create({ name, email, phone });

// export async function addContact(name, email, phone) {
//   try {
//     const newContact = { id: nanoid(), name, email, phone };
//     const allContacts = await listContacts();
//     allContacts.push(newContact);
//     await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
//     return newContact;
//   } catch (error) {
//     console.error("Error adding", error);
//     throw error;
//   }
// }
export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate({ _id: id }, data, { new: true });
// export async function updateContactById(id, updContact) {
//   try {
//     const contacts = await listContacts();
//     const index = contacts.findIndex((contact) => contact.id === id);
//     if (index === -1) {
//       return null;
//     }

//     contacts[index] = { ...contacts[index], ...updContact };
//     await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//     return contacts[index];
//   } catch (error) {
//     throw error;
//   }
// }
export const updateStatusContact = (id, status) =>
  Contact.findByIdAndUpdate({ _id: id }, { favorite: status }, { new: true });

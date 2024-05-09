import { readFile, writeFile } from "fs/promises";

import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
    const contacts = await readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error("Error reading", error);
    throw error;
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting by ID", error);
    throw error;
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
  } catch (error) {
    console.error("Error removing", error);
    throw error;
  }
}

export async function addContact(name, email, phone) {
  try {
    const newContact = { id: nanoid(), name, email, phone };
    const allContacts = await listContacts();
    allContacts.push(newContact);
    await writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding", error);
    throw error;
  }
}

export async function updateContactById(id, contact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }

  const updContact = { ...contacts[index], ...contact };
  contacts[index] = updContact;
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updContact;
  } catch (error) {
    throw error;
  }
}

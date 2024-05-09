import HttpError from "../helpers/HttpError.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import contactsService, {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contact = await listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* GET /api/contacts/:id

Викликає функцію-сервіс getContactById для роботи з json-файлом contacts.json

Якщо контакт за id знайдений, повертає об'єкт контакту в json-форматі зі статусом 200

Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404 */

export const getOneContact = async (req, res) => {
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

/* POST /api/contacts
Отримує body в json-форматі з полями {name, email, phone}. Усі поля є обов'язковими - для валідації створи у файлі contactsSchemas.js (знаходиться у папці schemas) схему з використаням пакета joi

Якщо в body немає якихось обов'язкових полів (або передані поля мають не валідне значення), повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400

Якщо body валідне, викликає функцію-сервіс addContact для роботи з json-файлом contacts.json, з передачею їй даних з body

За результатом роботи функції повертає новостворений об'єкт з полями {id, name, email, phone} і статусом 201 */

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

/* PUT /api/contacts/:id

Отримує body в json-форматі з будь-яким набором оновлених полів (name, email, phone) (всі поля вимагати в боді як обов'язкові не потрібно: якщо якесь із полів не передане, воно має зберегтись у контакта зі значенням, яке було до оновлення)

Якщо запит на оновлення здійснено без передачі в body хоча б одного поля, повертає json формату {"message": "Body must have at least one field"} зі статусом 400.

Передані в боді поля мають бути провалідовані - для валідації створи у файлі contactsSchemas.js (знаходиться у папці schemas) схему з використанням пакета joi. Якщо передані поля мають не валідне значення, повертає json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400

Якщо з body все добре, викликає функцію-сервіс updateContact, яку слід створити в файлі contactsServices.js (знаходиться в папці services). Ця функція має приймати id контакта, що підлягає оновленню, та дані з body, і оновити контакт у json-файлі contacts.json

За результатом роботи функції повертає оновлений об'єкт контакту зі статусом 200.

Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404 */

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updContact = await updateContactById(id, req.body);
    if (!updateContactById) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).send(updContact);
  } catch (error) {
    next(error);
  }
};

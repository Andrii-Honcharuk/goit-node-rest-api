// contactsRouter.js

import express from "express";
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getOneContactByIdController,
  updateContactController,
  updateStatusContactByIdController,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactFavoriteSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { checkAuthenticate } from "../middlewares/checkAuthenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(checkAuthenticate);

contactsRouter.get("/", getAllContactsController);

contactsRouter.get("/:id", getOneContactByIdController);

contactsRouter.delete("/:id", deleteContactController);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  createContactController
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  updateContactController
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactFavoriteSchema),
  updateStatusContactByIdController
);

export default contactsRouter;

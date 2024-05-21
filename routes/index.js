import express from "express";
import contactsRouter from "./contactsRouter.js";
import usersRouter from "./usersRouter.js";

const router = express.Router();
router.use("/contacts", contactsRouter);
router.use("/users", usersRouter);

export default router;

// usersRouter.js;

import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  uploadAvatarUserController,
  currentUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/usersControllers.js";
import { authSchema, loginSchema } from "../schemas/usersSchemas.js";
import { checkAuthenticate } from "../middlewares/checkAuthenticate.js";

import uploadMiddleware from "../middlewares/upload.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(authSchema), registerUserController);
usersRouter.post("/login", validateBody(loginSchema), loginUserController);
usersRouter.post("/logout", checkAuthenticate, logoutUserController);
usersRouter.get("/current", checkAuthenticate, currentUserController);

usersRouter.patch(
  "/avatars",
  checkAuthenticate,
  uploadMiddleware.single("avatar"),
  uploadAvatarUserController
);

export default usersRouter;

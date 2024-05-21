import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  currentUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/usersControllers.js";
import { authSchema, loginSchema } from "../schemas/usersSchemas.js";
import { checkAuthenticate } from "../middlewares/checkAuthenticate.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", validateBody(authSchema), registerUserController);
usersRouter.post("/login", validateBody(loginSchema), loginUserController);
usersRouter.post("/logout", checkAuthenticate, logoutUserController);
usersRouter.get("/current", checkAuthenticate, currentUserController);

export default usersRouter;

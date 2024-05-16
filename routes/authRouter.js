import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  register,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();
// const jsonParser = express.json();

authRouter.post("/register", validateBody(authSchema), register);
authRouter.post("/login", validateBody(authSchema), loginUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.get("/current", authenticate, currentUser);

export default authRouter;

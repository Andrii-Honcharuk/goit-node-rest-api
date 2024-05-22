import { errorWrapper } from "../helpers/errorWrapper.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/usersServices.js";

export const registerUserController = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);

  res.status(201).json({ user });
});

export const loginUserController = errorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser(email, password);

  res.status(200).json({ token, user });
});

export const logoutUserController = errorWrapper(async (req, res, next) => {
  await logoutUser(req.user.id);
  res.status(204).end();
});

export const currentUserController = errorWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

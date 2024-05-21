import HttpError from "../helpers/HttpError.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/usersServices.js";

export async function registerUserController(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);

    res.status(201).json({ user });
  } catch (error) {
    next(HttpError(409, error.message));
  }
}

export async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);

    res.status(200).json({ token, user });
  } catch (error) {
    next(HttpError(401, error.message));
  }
}

export async function logoutUserController(req, res, next) {
  try {
    await logoutUser(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function currentUserController(req, res) {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
}

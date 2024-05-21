import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/usersRepository.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (email, password) => {
  const existingUser = await usersRepository.findUserByEmail(email);

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await usersRepository.createUser({
    email,
    password: hashedPassword,
  });

  return { email: user.email, subscription: user.subscription };
};

export const loginUser = async (email, password) => {
  const user = await usersRepository.findUserByEmail(email);

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  await usersRepository.updateUserToken(user._id, token);

  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
};

export const logoutUser = async (userId) => {
  await usersRepository.clearUserToken(userId);
};

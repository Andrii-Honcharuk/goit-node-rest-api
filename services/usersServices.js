// usersServices;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import usersRepository from "../repositories/usersRepository.js";
import HttpError from "../helpers/HttpError.js";

export const registerUser = async (email, password) => {
  const existingUser = await usersRepository.findUserByEmail(email);

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Генерація URL аватарки за допомогою gravatar
  const avatarURL = gravatar.url(
    email,
    { s: "200", r: "pg", d: "retro" },
    true
  );

  const user = await usersRepository.createUser({
    email,
    password: hashedPassword,
    avatarURL, // URL аватарки
  });

  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
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

export const updateUserAvatarById = async (userId, avatarURL) => {
  const updatedUser = await usersRepository.updateUserAvatar(userId, avatarURL);
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};

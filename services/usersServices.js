// usersServices;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/usersRepository.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendMail from "../helpers/sendMail.js";

export const registerUser = async (email, password) => {
  const existingUser = await usersRepository.findUserByEmail(email);
  const verificationToken = nanoid();

  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(
    email,
    { s: "200", r: "pg", d: "retro" },
    true
  );

  const user = await usersRepository.createUser({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  await sendMail({
    to: email,
    from: "goncharukam@gmail.com",
    subject: "Welcome to register",
    html: `Confirm email. Please click <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
    text: `Confirm email. Please click http://localhost:3000/api/users/verify/${user.verificationToken}`,
  });

  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
    verificationToken: user.verificationToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await usersRepository.findUserByEmail(email);

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) throw HttpError(401, "Email or password is wrong");

  if (!user.verify) throw HttpError(401, "Please verify your email");

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
    throw HttpError("User not found");
  }
  return updatedUser;
};

export const verifyUserToken = async (verifyToken) => {
  const user = await usersRepository.verifyTokenUser(verifyToken);

  if (!user) throw HttpError(404, "User not found");

  if (user.alreadyVerified) {
    throw HttpError(400, "Verification has already been passed");
  }

  return user;
};

export const resendVerificationEmail = async (email) => {
  const user = await usersRepository.findUserByEmail(email);
  if (!user) {
    return { error: "User not found" };
  }

  if (user.verify) {
    return { error: "Verification has already been passed" };
  }

  await sendMail({
    to: email,
    from: "goncharukam@gmail.com",
    subject: "Email Verification",
    html: `Confirm email. Please click <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
    text: `Confirm email. Please click http://localhost:3000/api/users/verify/${user.verificationToken}`,
  });

  return { success: true };
};

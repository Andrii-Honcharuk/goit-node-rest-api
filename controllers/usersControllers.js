import path from "node:path";
import * as fs from "node:fs/promises";

import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import { errorWrapper } from "../helpers/errorWrapper.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  updateUserAvatarById,
  verifyUserToken,
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

export const uploadAvatarUserController = errorWrapper(
  async (req, res, next) => {
    if (!req.file) throw HttpError("File not found");

    const tmpPath = req.file.path;
    const newPath = path.resolve("public/avatars", req.file.filename);

    const image = await Jimp.read(tmpPath);

    await image.resize(250, 250).writeAsync(newPath);

    await fs.rename(tmpPath, newPath);

    const avatarURL = `/avatars/${req.file.filename}`;

    await updateUserAvatarById(req.user.id, avatarURL);

    res.status(200).json({ avatarUrl: avatarURL });
  }
);

export const verifyUserController = errorWrapper(async (req, res, next) => {
  const { verificationToken } = req.params;
  await verifyUserToken(verificationToken);
  res.status(200).json({ message: "Verification successful" });
});

export const resendVerificationEmailController = errorWrapper(
  async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const result = await resendVerificationEmail(email);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: "Verification email sent" });
  }
);

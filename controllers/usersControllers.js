// usersControllers.js;

import HttpError from "../helpers/HttpError.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatarById,
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

import * as fs from "node:fs";
import User from "../db/models/user.js";
import path from "node:path";

export async function uploadAvatarUserController(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("File not found");
    }

    const tmpPath = req.file.path;
    const newPath = path.resolve("public/avatars", req.file.filename);

    console.log(`Temporary file path: ${tmpPath}`);
    console.log(`New file path: ${newPath}`);

    fs.rename(tmpPath, newPath, async (err) => {
      if (err) {
        console.error(err);
        return next(HttpError(500, "Error moving file"));
      }

      console.log(`File uploaded: ${newPath}`);
      const avatarURL = `/avatars/${req.file.filename}`;

      try {
        await updateUserAvatarById(req.user.id, avatarURL);
        res.status(200).json({ avatarUrl: avatarURL });
      } catch (error) {
        next(HttpError(500, error.message));
      }
    });
  } catch (error) {
    console.log(error);
    next(HttpError(401, error.message));
  }
}

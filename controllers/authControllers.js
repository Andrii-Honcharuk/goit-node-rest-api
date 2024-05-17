import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { json } from "express";
import { token } from "morgan";

export async function register(req, res, next) {
  const { email, password } = req.body;
  try {
    const emailInLowerCase = email.toLowerCase();
    const newUser = await User.findOne({ email: emailInLowerCase });

    if (newUser !== null) {
      throw HttpError(409, "Email in use");
    }

    const passHash = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      email: emailInLowerCase,
      password: passHash,
    });

    res.status(201).json({
      user: {
        email: createUser.email,
        subscription: createUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();
  try {
    const logUser = await User.findOne({ email: emailInLowerCase });
    if (logUser === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, logUser.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: logUser._id }, process.env.SECRET_KEY, {
      expiresIn: 3600,
    });

    await User.findByIdAndUpdate(logUser._id, { token });
    res.status(200).json({
      token,
      user: { email: logUser.email, subscription: logUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(req, res, next) {
  console.log("--------------------------------");
  console.log("req", req.user);
  console.log("token", req.user.token);
  console.log("--------------------------------");
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    console.log("Logout", req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function currentUser(req, res) {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
}

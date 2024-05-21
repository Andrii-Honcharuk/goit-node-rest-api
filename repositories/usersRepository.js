import User from "../db/models/user.js";

const findUserByEmail = (email) => User.findOne({ email });

const createUser = (userData) => User.create(userData);

const updateUserToken = (id, token) =>
  User.findByIdAndUpdate(id, { token }, { new: true });

const clearUserToken = (id) =>
  User.findByIdAndUpdate(id, { token: null }, { new: true });

const findUserById = (id) => User.findById(id);

export default {
  findUserByEmail,
  createUser,
  updateUserToken,
  clearUserToken,
  findUserById,
};

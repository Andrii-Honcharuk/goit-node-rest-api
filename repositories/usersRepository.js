import User from "../db/models/user.js";

const findUserByEmail = (email) => User.findOne({ email });

const createUser = (userData) => User.create(userData);

const updateUserToken = (id, token) =>
  User.findByIdAndUpdate(id, { token }, { new: true });

const clearUserToken = (id) =>
  User.findByIdAndUpdate(id, { token: null }, { new: true });

const findUserById = (id) => User.findById(id);

const updateUserAvatar = (id, avatarURL) =>
  User.findByIdAndUpdate(id, { avatarURL }, { new: true });

const verifyTokenUser = async (verifyToken) => {
  const user = await User.findOne({ verificationToken: verifyToken });

  if (!user) {
    return null;
  }

  if (user.verify) {
    return { alreadyVerified: true };
  }

  const verifyUser = await User.findByIdAndUpdate(user._id.toString(), {
    verify: true,
    verificationToken: null,
  });

  return verifyUser;
};

export default {
  findUserByEmail,
  createUser,
  updateUserToken,
  clearUserToken,
  findUserById,
  updateUserAvatar,
  verifyTokenUser,
};

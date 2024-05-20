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

// // Логін користувача
export const loginUser = async (email, password) => {
  const user = await usersRepository.findUserByEmail(email);

  if (!user) throw HttpError(401, "Email or password is wrong");

  const isPasswordCorrect = await bcrypt.compare(password, user.password); // Порівнюємо введений пароль з хешем
  if (!isPasswordCorrect) {
    throw HttpError(401, "Email or password is wrong");
  } // Кидаємо помилку, якщо пароль неправильний
  //   }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  }); // Створюємо JWT токен
  await usersRepository.updateUserToken(user._id, token); // Оновлюємо токен користувача в базі даних

  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  }; // Повертаємо токен і дані користувача
};

// // Логаут користувача
export const logoutUser = async (userId) => {
  await usersRepository.clearUserToken(userId); // Оновлюємо токен користувача на null
};

// // Отримуємо поточного користувача
// export const getCurrentUser = async (userId) => {
//   const user = await usersRepository.findUserById(userId); // Знаходимо користувача за його ID
//   if (!user) {
//     throw new Error("User not found"); // Кидаємо помилку, якщо користувач не знайдений
//   }
//   return { email: user.email, subscription: user.subscription }; // Повертаємо дані користувача
// };

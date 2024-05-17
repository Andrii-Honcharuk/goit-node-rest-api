import user from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

export async function authenticate(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return next(HttpError(401, "Authorization header is missing"));
  }
  const [bearer, token] = authHeader.split(" ", 2);
  console.log({ bearer, token });
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Invalid token type"));
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const logUser = await user.findById(decode.id);
    if (!logUser || logUser.token !== token) {
      throw HttpError(401, "Invalid user or token");
    }
    if (!logUser._id || !logUser.email || !logUser.subscription) {
      throw HttpError(401, "User data is incomplete");
    }
    req.user = {
      id: logUser._id,
      email: logUser.email,
      subscription: logUser.subscription,
    };
    next();
  } catch (err) {
    console.log("Invalid token", err.message);
    next(HttpError(401, "Invalid token"));
  }
}

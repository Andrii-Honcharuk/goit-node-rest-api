// authenticate.js;

import user from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

export async function checkAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw HttpError(401, "Authorization header is missing");

    const [bearer, token] = authHeader.split(" ", 2);

    if (bearer !== "Bearer") throw HttpError(401, "Invalid token type");

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const logUser = await user.findById(decode.id);

    if (!logUser || logUser.token !== token)
      throw HttpError(401, "Invalid user or token");

    req.user = {
      id: logUser._id,
      email: logUser.email,
      subscription: logUser.subscription,
    };
    next();
  } catch (err) {
    next(HttpError(401, err.message));
  }
}

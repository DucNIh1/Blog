import AppError from "./AppError";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async () => {
  let token = null;
  if (req.headers && req.headers["Authorization"]) {
    token = req.headers["Authorization"].split(" ")[1];
  }
  token = req.cookies.refreshToken;

  if (token) throw new AppError("Unauthorized", 401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, result) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        throw new AppError("Unauthorized", 401);
      }
      throw new AppError(err.message, 401);
    }
  });
};

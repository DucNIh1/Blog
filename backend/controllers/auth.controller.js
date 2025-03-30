import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/AppError.js";
import pool from "../db/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userValidate } from "../utils/Validation.js";

const generateAccessToken = (user, res) => {
  try {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
}

// SIGNUP
export const signup = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    img = "https://img.freepik.com/premium-vector/boy-work-computers_987671-48.jpg?semt=ais_hybrid",
  } = req.body;
  console.log(req.body);
  const { error } = userValidate(req.body, "signup");

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const hashPassword = await bcrypt.hash(password, 10);

  if (users.length) return next(new AppError("User already exists", 409));

  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, img, isVerified) VALUES (?, ?, ?, ?,?)",
    [username, email, hashPassword, img, 1]
  );
  res.status(201).json({
    message: "Signup successful",
  });
});

//LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = userValidate(req.body, "login");

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const [users] = await pool.query("SELECT * from users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return next(new AppError("Email or Password incorrect", 400));
  }

  const user = users[0];

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(new AppError("Email or Password incorrect", 400));
  }

  const accessToken = generateAccessToken(user, res);
  res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      img: user.img,
      role: user.role,
    },
  });
});

//LOGOUT
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};



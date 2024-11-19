import catchAsync from "../utils/CatchAsync.js";
import AppError from "../utils/AppError.js";
import pool from "../db/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { userValidate } from "../utils/Validation.js";
import redisClient from "../redis/config.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
} from "../nodemail/mails.js";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

const generateAccessToken = (user, res) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60,
  });

  return token;
};

const generateRefreshToken = async (user, res) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );

  await redisClient.set(user.id.toString(), `${token}`, {
    EX: 60 * 60 * 24 * 30,
  });

  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  return token;
};

// SIGNUP
export const signup = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    img = "https://img.freepik.com/premium-vector/boy-work-computers_987671-48.jpg?semt=ais_hybrid",
  } = req.body;

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
    "INSERT INTO users (username, email, password, img) VALUES (?, ?, ?, ?)",
    [username, email, hashPassword, img]
  );

  const userId = result.insertId;

  // Tạo mã xác minh gồm 6 số
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Lưu vô redis
  const verifyKey = `verify:${userId}`;
  await redisClient.set(verifyKey, verificationToken, {
    EX: 60 * 60 * 24, // 1 ngày
  });

  // Send email
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    message: "Signup successful, Please check your email to verify account!",
    id: userId,
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

  if (users[0].google_id) {
    return next(
      new AppError("Please Login with Google account with this email", 400)
    );
  }
  const user = users[0];

  // Compare password
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(new AppError("Email or Password incorrect", 400));
  }

  // Nếu chưa verify thì tạo mã xác minh
  if (user.isVerified === 0) {
    // Tạo mã xác minh gồm 6 số
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Lưu vô redis
    const verifyKey = `verify:${user.id}`;
    await redisClient.set(verifyKey, verificationToken, {
      EX: 60 * 60 * 24, // 1 ngày
    });

    // Send email
    await sendVerificationEmail(email, verificationToken);

    return res
      .status(200)
      .json({ message: "Please verify your acount", id: user.id });
  }

  // Generate token
  const accessToken = generateAccessToken(user, res);
  const refreshToken = await generateRefreshToken(user, res);

  res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
    refreshToken,
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
    const token = req.cookies?.refreshToken;

    if (!token) return next(new AppError("Unauthorized", 401));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    await redisClient.del(decoded.userId.toString());

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

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

//LOGIN GOOGLE
export const loginWithGoole = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GG_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const q = "SELECT * FROM users WHERE google_id = ?";

  const [users] = await pool.query(q, [payload.sub]);

  let user;

  if (!users.length) {
    await pool.query(
      "INSERT INTO users (username, email, img, google_id, isVerified) VALUES (?, ?, ?, ?, ?)",
      [payload.name, payload.email, payload.picture, payload.sub, 1]
    );

    const [newUsers] = await pool.query(q, [payload.sub]);
    user = newUsers[0];
  } else {
    user = users[0];
  }

  // Tạo token và trả về thông tin người dùng
  const accessToken = generateAccessToken(user, res);
  const refreshToken = await generateRefreshToken(user, res);
  res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      img: user.img,
      role: user.role,
    },
  });
});

// CHANGE PASSWORD
export const changePassword = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  let q = "";
  q = "SELECT * FROM users WHERE id = ?";
  const [users] = await pool.query(q, [userId]);

  if (!users.length) return next(new AppError("User not found"), 404);

  const comparePassword = await bcrypt.compare(
    currentPassword,
    users[0].password
  );

  if (!comparePassword) {
    return next(new AppError("Current password is incorrect", 400));
  }

  q = "UPDATE users SET password = ? WHERE id = ?";

  const hashPassword = await bcrypt.hash(newPassword, 10);

  const [result] = await pool.query(q, [hashPassword, userId]);

  if (result.affectedRows === 0)
    return next(new AppError("Change password failed", 500));

  res.status(200).json({ message: "Change password successfully" });
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : req.cookies?.refreshToken;

  if (!token)
    return next(new AppError("Unauthorized. No token provided.", 401));

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Unauthorized", 401));
      }
      if (err.name === "TokenExpiredError") {
        return next(new AppError(err.message, 403));
      }
      return next(new AppError(err.message, 401));
    }

    // Check token trong redis
    const storedToken = await redisClient.get(decoded.userId.toString());

    if (!storedToken || storedToken !== token) {
      return next(new AppError("Unauthorized. Token mismatch.", 401));
    }

    const accessToken = generateAccessToken(
      {
        id: decoded.userId,
        role: decoded.role,
      },
      res
    );

    const refreshToken = await generateRefreshToken(
      {
        id: decoded.userId,
        role: decoded.role,
      },
      res
    );

    return res.json({
      accessToken,
      refreshToken,
    });
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { userId } = req.query;

  const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);
  console.log(users);
  if (users.length === 0) {
    return next(new AppError("No users found", 404));
  }

  // Check code matches
  const verifyCode = await redisClient.get(`verify:${userId}`);

  if (!verifyCode) return next(new AppError("Invalid verification code", 400));

  if (code !== verifyCode)
    return next(new AppError("Invalid verification code", 400));

  const q = "UPDATE users SET isVerified = 1 WHERE id = ?";

  await pool.query(q, [userId]);

  // Generate token
  const accessToken = generateAccessToken(users[0], res);
  const refreshToken = await generateRefreshToken(users[0], res);

  // Xóa verify token trong redis
  await redisClient.del(`verify:${userId}`);

  res.status(200).json({
    message: "Verified account successfully",
    accessToken: accessToken,
    refreshToken,
    user: {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      img: users[0].img,
      role: users[0].role,
    },
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  const user = users[0];

  if (users.length === 0) return next(new AppError("User not found", 400));

  // Tao reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Lưu vô redis
  await redisClient.set(`resetToken:${user.id}`, resetToken, {
    EX: 60 * 15, // 15m
  });

  await sendPasswordResetEmail(
    email,
    `${process.env.URL_RESET_PASSWORD}/${resetToken}?userId=${user.id}`
  );
  res.status(200).json({
    message: "Send reset password email successfully. Please check your email!",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password, userId } = req.body;
  const token = req.params.token;

  const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);

  const user = users[0];

  if (users.length === 0) return next(new AppError("User not found", 400));

  const resetToken = await redisClient.get(`resetToken:${userId}`);

  if (resetToken !== token) return next("Invalid reset password token", 400);

  const hashPassword = await bcrypt.hash(password, 10);

  await pool.query("UPDATE users SET password = ? WHERE id = ?", [
    hashPassword,
    userId,
  ]);

  await redisClient.del(`resetToken:${user.id}`);
  await sendResetSuccessEmail(user.email);

  res.status(200).json({ message: "Password recovery successful!" });
});

import express from "express";
import dotenv from "dotenv";
import pool from "./db/config.js";
import cookieParser from "cookie-parser";
import handleError from "./controllers/err.controller.js";
import AppRouter from "./routes/index.js";
import cors from "cors";

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    console.log("Kết nối đến cơ sở dữ liệu thành công!");
    connection.release();
  } catch (error) {
    console.error("Lỗi kết nối đến cơ sở dữ liệu:", error.message);
  }
};

checkDatabaseConnection();

AppRouter(app);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.use(handleError);

app.listen(port, (req, res, next) => {
  console.log(`Server listening on ${port}`);
});

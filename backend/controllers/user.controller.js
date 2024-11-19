import catchAsync from "../utils/CatchAsync.js";
import pool from "../db/config.js";
import AppError from "../utils/AppError.js";

const filter = async function (
  baseQuery,
  { page = 1, limit = 4, username, isActive, sort, role }
) {
  const offset = (+page - 1) * limit;

  // Khởi tạo WHERE clause và một mảng để giữ các tham số truy vấn
  let whereClauses = [];
  let queryParams = [];

  if (username) {
    whereClauses.push("users.username LIKE ?");
    queryParams.push(`%${username}%`);
  }

  if (isActive) {
    whereClauses.push("users.isActive = ?");
    queryParams.push(isActive);
  }
  if (role) {
    whereClauses.push("users.role = ?");
    queryParams.push(role);
  }
  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  baseQuery += ` GROUP BY users.id`;
  const orderBy = sort === "asc" ? "ASC" : "DESC";
  baseQuery += ` ORDER BY users.created_at ${orderBy}`;

  baseQuery += " LIMIT ? OFFSET ?  ";
  queryParams.push(+limit, +offset);

  const [results] = await pool.query(baseQuery, queryParams);

  let countQuery = "SELECT COUNT(*) AS totalUsers FROM users";
  if (whereClauses.length > 0) {
    countQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  let [totalUsers] = await pool.query(countQuery, queryParams.slice(0, -2)); // Sử dụng các tham số bộ lọc, không bao gồm limit và offset

  const totalPages = Math.ceil(totalUsers[0].totalUsers / limit);
  return { results, totalPages: totalPages };
};

export const updateProfile = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const {
    username,
    img,
    bio,
    profession,
    birth_date,
    gender,
    country,
    fb_url,
    github_url,
    ig_url,
  } = req.body;
  const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);

  if (!users.length) return next(new AppError("Couldn't find users", 404));

  const dataParams = [
    username || users[0].username,
    img || users[0].img,
    bio || users[0].bio,
    profession || users[0].profession,
    birth_date || users[0].birth_date,
    gender || users[0].gender,
    country || users[0].country,
    fb_url || users[0].fb_url,
    github_url || users[0].github_url,
    ig_url || users[0].ig_url,
    userId,
  ];

  const q =
    "UPDATE users SET username =?, img =?, bio = ?, profession=?, birth_date=?,gender=? ,country=?, fb_url=?, github_url=?, ig_url=? WHERE id = ?";

  const [result] = await pool.query(q, dataParams);

  if (result.affectedRows == 0)
    return next(new AppError("Update users failed", 404));

  res.status(200).json({ message: "Update profile successfully" });
});

export const getMe = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const q = "SELECT * FROM users WHERE id = ?";

  const [users] = await pool.query(q, [userId]);

  if (users.length === 0) return next(new AppError("User not found", 404));

  const { password, isVerified, isActive, ...infors } = users[0];
  res.status(200).json({
    user: infors,
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const q = "DELETE FROM users WHERE id= ?";

  const [result] = await pool.query(q, [userId]);

  if (result.affectedRows === 0)
    return next(new AppError("User not found", 404));

  res.status(200).json({ message: "Deleted successfully" });
});

export const getAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 4 } = req.query;
  const offset = (page - 1) * limit;

  const q =
    "SELECT u.username, u.img , u.gender, u.country, u.email, u.profession, u.fb_url, u.github_url, u.ig_url, u.bio FROM users as u  WHERE  u.id = ?  ";

  const [authors] = await pool.query(q, [id]);

  if (authors.length === 0) return next(new AppError("Author not found", 404));

  const [posts] = await pool.query(
    "SELECT p.title, p.img, p.created_at, p.updated_at, p.teaser, c.name as cat FROM posts as p INNER JOIN categories as c ON p.cat_id = c.id WHERE p.user_id = ? AND status = 'published' LIMIT ? OFFSET ?",
    [id, +limit, +offset]
  );
  const totalPages = Math.ceil(posts.length / limit);

  res.json({ infor: authors[0], posts, totalPages });
});

// ADMIN
export const changeUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params; // user id
  const { isActive } = req.body;
  console.log(isActive);
  const q = "UPDATE users SET isActive = ?  WHERE id = ?";

  const [result] = await pool.query(q, [isActive, id]);

  if (result.affectedRows === 0)
    return next(new AppError("Change user active failed"));

  return res.status(200).json({ message: "Change user active successfully" });
});

export const changeUserRole = catchAsync(async (req, res, next) => {
  const { id } = req.params; //user id;
  const { role } = req.body;
  console.log(role);
  if (!role) return next(new AppError("Role is required", 400));

  if (role !== "user" && role !== "admin")
    return next(new AppError("Invalid role", 400));

  const q = "UPDATE users SET role = ?  WHERE id = ?";

  const [result] = await pool.query(q, [role, id]);

  if (result.affectedRows === 0)
    return next(new AppError("User not found", 404));

  res.status(200).json({ message: "Change user's role successfully" });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params; // user id
  const q = "DELETE FROM users WHERE id = ?";

  const [result] = await pool.query(q, [id]);

  if (result.affectedRows === 0)
    return next(new AppError("User not found", 404));

  return res.status(200).json({ message: "Delete user successfully" });
});
export const getAllUsers = catchAsync(async (req, res, next) => {
  const baseQuery =
    "SELECT users.img , users.email , users.id,users.username,users.role, users.isActive, COUNT(posts.id) as totalPosts FROM users LEFT JOIN posts ON users.id = posts.user_id";

  const { results, totalPages } = await filter(baseQuery, req.query);

  res.status(200).json({ users: results, totalPages: totalPages });
});

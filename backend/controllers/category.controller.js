import catchAsync from "../utils/CatchAsync.js";
import pool from "../db/config.js";
import AppError from "../utils/AppError.js";

const filter = async function (
  baseQuery,
  { page = 1, limit = 4, name, isActive, sort }
) {
  const offset = (+page - 1) * limit;

  // Khởi tạo WHERE clause và một mảng để giữ các tham số truy vấn
  let whereClauses = [];
  let queryParams = [];

  if (name) {
    whereClauses.push("c.name LIKE ?");
    queryParams.push(`%${name}%`);
  }

  if (isActive) {
    whereClauses.push("c.isActive = ?");
    queryParams.push(+isActive);
  }

  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  baseQuery += ` GROUP BY c.id, c.name, c.isActive`;

  const orderBy = sort === "asc" ? "ASC" : "DESC";
  baseQuery += ` ORDER BY total ${orderBy}`;

  baseQuery += " LIMIT ? OFFSET ?";
  queryParams.push(+limit, +offset);

  const [results] = await pool.query(baseQuery, queryParams);

  let countQuery = "SELECT COUNT(*) AS totalCategories FROM categories as c";
  if (whereClauses.length > 0) {
    countQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  let [totalCategories] = await pool.query(
    countQuery,
    queryParams.slice(0, -2)
  );

  const totalPages = Math.ceil(totalCategories[0].totalCategories / limit);
  return { results, totalPages: totalPages };
};

export const getAllCategories = catchAsync(async (req, res, next) => {
  const baseQuery =
    "SELECT  c.id, c.name, c.isActive ,COUNT(p.id) as total   FROM categories as c LEFT JOIN posts as p on c.id = p.cat_id";
  const { results, totalPages } = await filter(baseQuery, req.query);

  res.status(200).json({ categories: results, totalPages });
});

export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const [categories] = await pool.query(
    "SELECT * FROM categories WHERE name = ?",
    [name]
  );

  if (categories.length > 0)
    return next(new AppError("This category already exists", 400));

  const q = "INSERT INTO categories (name) VALUES (?)";

  const [result] = await pool.query(q, [name]);

  res.status(200).json({ message: "Add category successfully" });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isActive, name } = req.body;

  const [categories] = await pool.query(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );

  if (categories.length === 0)
    return next(new AppError("Category not found", 404));

  const dataParams = [
    name || categories[0].name,
    isActive || categories[0].isActive,
    id,
  ];

  const q = "UPDATE categories SET name = ? , isActive = ?  WHERE id = ?";

  await pool.query(q, dataParams);

  res.status(200).json({ message: "Category updated successfully" });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const q = "DELETE FROM categories WHERE id = ?";

  const [result] = await pool.query(q, [id]);

  if (result.affectedRows === 0)
    return next(new AppError("Category not found", 404));

  res.status(200).json({ message: "Category deleted successfully" });
});

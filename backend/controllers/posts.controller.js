import catchAsync from "../utils/CatchAsync.js";
import pool from "../db/config.js";
import AppError from "../utils/AppError.js";

const filter = async function (
  baseQuery,
  { page = 1, limit = 4, cat, title, status, sort, isFeatured },
  userId
) {
  const offset = (+page - 1) * limit;

  // Khởi tạo WHERE clause và một mảng để giữ các tham số truy vấn
  let whereClauses = [];
  let queryParams = [];

  if (cat) {
    whereClauses.push("p.cat_id = ?");
    queryParams.push(cat);
  }

  if (title) {
    whereClauses.push("p.title LIKE ?");
    queryParams.push(`%${title}%`);
  }

  if (isFeatured) {
    whereClauses.push("p.isFeatured = ?");
    queryParams.push(+isFeatured);
  }

  if (status) {
    whereClauses.push("p.status = ?");
    queryParams.push(status);
  }

  if (userId) {
    whereClauses.push("p.user_id = ?");
    queryParams.push(userId);
  }

  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  const orderBy = sort === "asc" ? "ASC" : "DESC";
  baseQuery += ` ORDER BY p.created_at ${orderBy}`;

  baseQuery += " LIMIT ? OFFSET ?";
  queryParams.push(+limit, +offset);

  // Thực hiện câu truy vấn
  const [results] = await pool.query(baseQuery, queryParams);

  let countQuery = "SELECT COUNT(*) AS totalPosts FROM posts as p";
  if (whereClauses.length > 0) {
    countQuery += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  let [totalPosts] = await pool.query(countQuery, queryParams.slice(0, -2));

  totalPosts = Math.ceil(totalPosts[0].totalPosts / limit);
  return { results, totalPages: totalPosts };
};

export const getPosts = catchAsync(async (req, res, next) => {
  let baseQuery = `
    SELECT p.id, p.img, p.title, p.content, p.teaser, p.created_at, p.user_id, p.status, p.isFeatured, p.cat_id,
           u.username, u.email, u.img as user_img, c.name as category_name
    FROM posts as p
    INNER JOIN users as u ON p.user_id = u.id
    INNER JOIN categories as c ON p.cat_id = c.id
  `;

  const { results, totalPages } = await filter(baseQuery, req.query);

  res.status(200).json({
    posts: results,
    total: totalPages,
  });
});

// Get one post by id
export const getPost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const q =
    "SELECT u.username, u.img as user_img, u.id as user_id, u.email, p.title, p.content, p.img , p.created_at,p.updated_at ,p.id , p.cat_id, p.teaser, p.status, p.isFeatured FROM users u INNER JOIN posts p ON u.id = p.user_id WHERE p.id = ?";

  const [posts] = await pool.query(q, [id]);

  if (posts.length === 0) {
    return next(new AppError("No posts found", 404));
  }
  const post = posts[0];

  res.status(200).json({ post });
});

export const getMyPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const baseQuery =
    "SELECT p.id, p.status ,p.img, p.title, p.teaser, p.content, p.created_at, c.id as cat_id, c.name as cat_name from posts as p inner join categories as c on p.cat_id = c.id";
  const { results, totalPages } = await filter(baseQuery, req.query, userId);

  res.status(200).json({ posts: results, total: totalPages });
});

export const getReleatedPosts = catchAsync(async (req, res, next) => {
  const { cat, post_id } = req.params;
  console.log(cat, post_id);
  const q = `SELECT p.id, p.img, p.title, p.content, p.teaser, p.created_at, p.user_id, u.username, u.email, u.img as user_img, c.name as category_name
     FROM posts as p
     INNER JOIN users as u ON p.user_id = u.id
     INNER JOIN categories as c ON p.cat_id = c.id WHERE p.cat_id = ? AND p.id != ?`;

  const [posts] = await pool.query(q, [req.query.cat, req.query.post_id]);

  if (posts.length === 0) {
    return next(new AppError("No posts found", 404));
  }

  res.status(200).json({ posts });
});

//admin
export const setFeaturedPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { cat, isFeatured } = req.body;
  if (+isFeatured === 1) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) AS featured_count FROM posts WHERE cat_id = ? AND isFeatured = 1",
      [cat]
    );
    console.log(rows[0]);
    if (rows[0].featured_count >= 3) {
      return next(
        new AppError("This category has enough featured articles.", 400)
      );
    }
  }

  await pool.query("UPDATE posts SET isFeatured = ? WHERE id = ?", [
    isFeatured,
    id,
  ]);
  res.json({ message: "The article's isFeatured has been changed." });
});

// Delete post by id
export const deletePost = catchAsync(async (req, res, next) => {
  const { userId, role } = req.user;

  const id = req.params.id;

  let q =
    role === "admin"
      ? "DELETE  FROM posts WHERE id = ?"
      : "DELETE  FROM posts WHERE id = ? AND user_id = ?";

  const [result] = await pool.query(q, [id, userId]);

  if (result.affectedRows === 0) {
    return next(
      new AppError("Post not found or you can delete this post", 404)
    );
  }

  res.status(200).json({ message: "Delete post successfully" });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { userId } = req.user;
  const { title, content, img, cat_id, teaser } = req.body;
  const q =
    "UPDATE posts SET title = ?, content = ?, img = ?, cat_id= ?, teaser= ? WHERE id = ? AND user_id = ?";

  const [result] = await pool.query(q, [
    title,
    content,
    img,
    cat_id,
    teaser,
    id,
    userId,
  ]);

  if (result.affectedRows === 0) {
    return next(
      new AppError(
        "Post not found or you don't have permission to update this post",
        404
      )
    );
  }

  res.status(200).json({ message: "Update post successfully" });
});

export const createPost = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { title, content, img, cat_id, teaser, status } = req.body;

  if (!title || !content || !img || !cat_id || !teaser)
    return next(new AppError("Please fill all required fields"));

  const q =
    "INSERT INTO posts (title, content, img, cat_id, user_id, teaser,status) VALUES (?,?,?,?,?,?,?)";

  const [result] = await pool.query(q, [
    title,
    content,
    img,
    cat_id,
    userId,
    teaser,
    status,
  ]);
  res.status(201).json({
    status: "success",
    message: "Post created successfully",
  });
});

//User publish their post
export const publishPost = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  const q =
    "UPDATE posts SET status = 'pending' WHERE id = ? AND status = 'draft' AND user_id = ?";

  const [result] = await pool.query(q, [id, userId]);

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json({ message: "Post not found or already published." });
  }

  res.status(200).json({ message: "Published successfully", result: result });
});

//admin
export const changePostStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const q = "UPDATE posts SET status = ? WHERE id = ?";
  const [result] = await pool.query(q, [status, id]);

  if (result.affectedRows === 0)
    return next(new AppError("Change post status failed"));

  res.status(200).json({ message: "Change post status successfully" });
});

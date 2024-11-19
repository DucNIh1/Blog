import catchAsync from "../utils/CatchAsync.js";
import pool from "../db/config.js";
import AppError from "../utils/AppError.js";

// [POST] : /
export const createComment = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const { content, post_id } = req.body;

  const q = "INSERT INTO comments (user_id, post_id, content) VALUES (?,?,?)";

  const [result] = await pool.query(q, [userId, post_id, content]);

  if (result.affectedRows === 0)
    return next(new AppError("Comment failed to be created", 400));

  res.status(200).json({ message: "Comment created successfully" });
});

// [GET] /:id
export const getComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.query;

  const q = `
    SELECT 
      c.id, 
      c.content, 
      u.img, 
      u.username, 
      COUNT(l.id) as likes, 
      MAX(l.user_id = ?) as isLiked 
    FROM 
      comments AS c 
    INNER JOIN 
      users AS u ON c.user_id = u.id 
    LEFT JOIN 
      likes AS l ON c.id = l.comment_id 
    WHERE 
      c.post_id = ? 
    GROUP BY 
      c.id, u.id
  `;

  const [comments] = await pool.query(q, [userId, id]);

  res.status(200).json({ comments: comments || [] });
});

// [PATCH]: /:id/like
export const likeComment = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  // kiem tra xem co comment do k
  const [comments] = await pool.query("SELECT * FROM comments WHERE id = ?", [
    id,
  ]);

  if (!comments.length) return next(new AppError("Comment not found", 404));

  //Kiem tra xem user da like comment do chua

  const [userLike] = await pool.query(
    "SELECT * FROM likes WHERE user_id = ? AND comment_id = ?",
    [userId, id]
  );

  const q = userLike[0]
    ? "DELETE FROM  likes  WHERE  user_id = ? AND comment_id = ?"
    : "INSERT INTO  likes (user_id, comment_id) VALUES (?, ?)";

  const [result] = await pool.query(q, [userId, id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Create comment failed"));
  }

  res.status(200).json({ message: "Ok" });
});

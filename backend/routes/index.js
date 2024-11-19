import authRouter from "./auth.route.js";
import usersRouter from "./users.route.js";
import postsRouter from "./posts.route.js";
import uploadRouter from "./upload.route.js";
import categoryRouter from "./category.route.js";
import commensRouter from "./comments.route.js";

const AppRouter = (app) => {
  app.use("/api/comments", commensRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
};

export default AppRouter;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? "fail" : "error";
    this.isOprational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

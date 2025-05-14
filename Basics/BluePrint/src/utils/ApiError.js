class ApiError extends Error {
  constructor(
    statusCode,
    stack = "",
    message = "Something Went Wrong",
    Error = []
  ) {
    super(message)
    
    this.statusCode = statusCode
      this.Error = Error
      this.message = message
      this.success = false
      this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

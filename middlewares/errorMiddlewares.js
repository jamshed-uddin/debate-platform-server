const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);

  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).send({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };

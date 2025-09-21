const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  if (res.headersSent) {
    console.log('Headers already sent, skipping error response');
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { errorHandler };

const errorHandler = (err, req, res, next) => {
  console.error(`[Error]: ${err.message}`);
  console.error(`[Stack]: ${err.stack}`);

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = 'Internal Server Error';

  // Handle ClickHouse specific errors
  if (err.message && err.message.includes('DB::Exception')) {
    statusCode = 400;
    message = 'Database Query Error';
  }

  // Handle network/connection errors
  if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Database Service Unavailable';
  }

  // Handle authentication errors
  if (err.message && err.message.includes('REQUIRED_PASSWORD')) {
    statusCode = 401;
    message = 'Database Authentication Failed';
  }

  // Handle timeout errors
  if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
    statusCode = 504;
    message = 'Request Timeout';
  }

  // Handle validation errors
  if (err.message && err.message.includes('UNKNOWN_IDENTIFIER')) {
    statusCode = 400;
    message = 'Invalid Query: Column or Table Not Found';
  }

  // Handle 404 errors
  if (statusCode === 404) {
    message = 'Resource Not Found';
  }

  const response = {
    success: false,
    message,
    error: err.message || 'Unknown error occurred',
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };

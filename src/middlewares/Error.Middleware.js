const errorFormatter = (error) => {
  const errorResponse = {
    error: true,
    status: error.status,
    message: error.message,
    reason: error.reason,
  };
  if (error.isJoi && error.details.length > 0) {
    console.error('JoiError', error);
    Object.assign(errorResponse, error.details[0]);
    errorResponse.details = error.details;
  }
  if (error.sql) {
    console.error('SqlError', error);
    if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].includes(error.name)) {
      errorResponse.status = 400;
      errorResponse.reason = error.errors && error.errors.map((err) => `${err.type}: ${err.message}`).join(',\n');
      if (error.errors) {
        error.errors.forEach((err) => {
          delete err.instance;
        });
      }
      errorResponse.errors = error.errors;
    }
  }
  if (error.isAxiosError) {
    console.error('AxiosError', error);
    if (error.response) {
      errorResponse.status = error.response.status;
      if (error.response.data && error.response.data.message) {
        errorResponse.message = error.response.data.message;
      }
    }
  }
  return errorResponse;
};

module.exports.ErrorMiddleware = () => (ctx, next) => next()
  .catch((error) => {
    const response = errorFormatter(error);
    ctx.body = response;
    ctx.status = response.status || 500;
  });

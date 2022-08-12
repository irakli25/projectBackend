const Joi = require('joi');

module.exports.Joi = Joi;

module.exports.Validator = (inputs) => {
  const {
    query,
    params,
    body,
  } = inputs;
  return async (ctx, next) => {
    try {
      if (query) {
        await Joi.object(query).validateAsync(ctx.request.query);
      }
      if (params) {
        await Joi.object(params).validateAsync(ctx.params);
      }
      if (body) {
        await Joi.object(body).validateAsync(ctx.request.body);
      }
      return next();
    } catch (error) {
      return ctx.throw(400, error);
    }
  };
};

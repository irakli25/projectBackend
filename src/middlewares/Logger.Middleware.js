const PinoLogger = require('koa-pino-logger');
const { format } = require('date-fns');

module.exports.Logger = (app) => {
  app.use(async (ctx, next) => {
    if (ctx.request.body) {
      ctx.req.body = ctx.request.body;
    }
    return next();
  });
  app.use(PinoLogger({
    timestamp: () => `,"time":"${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}"`,
    serializers: {
      req(req) {
        if (req.raw && req.raw.body) {
          req.body = req.raw.body;
        }
        return req;
      },
      res(res) {
        if (res.raw && res.raw.body) {
          res.body = res.raw.body;
        }
        delete res.headers;
        return res;
      },
    },
    autoLogging: {
      ignorePaths: ['/api/health'],
    },
  }));

  app.use(async (ctx, next) => next()
    .then(() => {
      ctx.res.body = ctx.body;
    }));
};

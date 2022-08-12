const Router = require('@koa/router');
const authRouter = require('./auth.route');

const router = new Router({
    prefix: '/api',
});

router.use(authRouter.middleware());
  
module.exports = router;
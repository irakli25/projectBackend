const Router = require('@koa/router');
const user_controller = require('../controllers/auth.controller');
const register_middleware = require('../middlewares/Register.Middleware');
const login_middleware = require('../middlewares/Login.middleware');

const router = new Router({
    prefix: '/auth',
});


router.post('/register', register_middleware.checkNewUser, user_controller.Register);
router.post('/login', login_middleware.LoginUser, user_controller.Login);
// route.post('/token', auth_middleware.verifyRefreshToken, user_controller.GetAccessToken);
// route.get('/logout', auth_middleware.verifyToken, user_controller.Logout);

module.exports = router;
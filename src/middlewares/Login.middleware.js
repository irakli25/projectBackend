const { User } = require('../db/models');

module.exports.LoginUser = async (ctx, next) => {
    try {
        const user = ctx.request.body;
        const email = user.email;
        const userByEmail = await User.findOne({
            where: {
                email,
            },
        });
        if (!userByEmail) {
            ctx.status = 401;
            return ctx.body = { error: true, message : 'Email not correct', user};
        }
        ctx.login = user;
        ctx.userByEmail = userByEmail;
        return next();
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = {status: false, message: "Your session is not valid.", data: error};
    }       
}
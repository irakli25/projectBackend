const { User } = require('../db/models');

module.exports.checkNewUser = async (ctx, next) => {
    try {
        const newUser = ctx.request.body;
        const email = newUser.email;
        const userByEmail = await User.findOne({
            where: {
                email,
            },
        });
        if (userByEmail) {
            ctx.status = 409;
            return ctx.body = { error: true, message : 'Email already exists', newUser};
        }
        
        ctx.newUser = newUser;
        return next();
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = {status: false, message: "Your session is not valid.", data: error};
    }       
}
const jwt = require('jsonwebtoken');
const test = 'test';
const clientId = '579674';
const clientName = 'Ibank';
const typ = "Bearer";
module.exports.getToken = async ctx => {
    const token = jwt.sign({test, clientId, clientName}, process.env.TOKEN_SECRET);
    ctx.session.token = token;
    // ctx.session.
    return token;
}
// const typ = "Bearer";
module.exports.getRefreshToken = async ctx => {
    const token = jwt.sign({test, clientId, clientName}, process.env.REFRESH_TOCKEN_SECRET);
    return ctx.session.token;
}
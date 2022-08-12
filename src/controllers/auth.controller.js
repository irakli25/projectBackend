const authService = require('../services/auth.service');
const { User } = require('../db/models');
const jwt = require('jsonwebtoken');

// Register
module.exports.Register = async (ctx) => {
    const user = new User(ctx.newUser);

    try {
        const saved_user = await user.save();
        ctx.status = 200;
        return ctx.body = {status: true, message: "Registered successfully."};

    } catch (error) {
        ctx.status = 400;
        return ctx.body = {status: false, message: "Something went wrong.", data: error};
    }
}

// Login
module.exports.Login = async (ctx) => {
    try {
       const validPassword = await ctx.userByEmail.validPassword(ctx.login.password, ctx.userByEmail.password);
       if(validPassword){
        const user = ctx.userByEmail;
        const tokenData = {sub: user.id, userName: user.firstName, typ: 'Bearer'};
        ctx.status = 200;
        ctx.body = GetAccessToken(tokenData);
       }
       else {
        ctx.status = 401;
        ctx.body = {status: validPassword, message: 'password incorrect', user: ctx.login};
       }
    }
    catch (error) {
        console.log(error)
        ctx.status = 400;
        return ctx.body = {status: false, message: "Something went wrong.", error};
    }
}


function GetAccessToken (data) {
    const access_token = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME});
    const refresh_token = GenerateRefreshToken(data);
    return {status: true, message: "success", data: {access_token, refresh_token}};
}

function GenerateRefreshToken(data) {
    const refresh_token = jwt.sign(data, process.env.REFRESH_TOCKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });
    
    // redis_client.get(user_id.toString(), (err, data) => {
    //     if(err) throw err;

    //     redis_client.set(user_id.toString(), JSON.stringify({token: refresh_token}));
    // })

    return refresh_token;
}





/* token example 

Bearer : eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHQ1d6X1JKOXQzRVFiSHZpMFFRU0NqdV84bkZQX2IweHYzMVljYzRlSWZJIn0.eyJleHAiOjE2NTk4NjUwNTgsImlhdCI6MTY1OTg2NDc1OCwiYXV0aF90aW1lIjoxNjU5ODY0NzU4LCJqdGkiOiI0NmI4ZDdlNC03ODQzLTQzNmQtYjQ2ZC1hNjMxNTg2YmVjY2IiLCJpc3MiOiJodHRwczovL2FjY291bnQuYm9nLmdlL2F1dGgvcmVhbG1zL2JvZyIsImF1ZCI6WyJjaWIiLCJhY2NvdW50Il0sInN1YiI6ImY6MjdjZDkwNGYtNWNjNi00NmM0LTk5ZTktZDk0MDdkNjFhNWNlOjEyMzgwMTEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJyaWJ3ZWIiLCJzZXNzaW9uX3N0YXRlIjoiMzFjMDdjMmQtYzI4OC00OTdmLWFiMDgtOWI0ZmJmNDc0NTJhIiwiYWNyIjoiMSIsInNjb3BlIjoib3BlbmlkIG1vYmlsZS1zc28tc2NvcGUgcmJfbWlkZGxld2FyZV9zY29wZSIsInNpZCI6IjMxYzA3YzJkLWMyODgtNDk3Zi1hYjA4LTliNGZiZjQ3NDUyYSIsImNsaWVudF9rZXkiOiIxMTkzMTYwNDYiLCJjaXNfdXNlcl9pZCI6IjEyMzgwMTEiLCJjbGllbnRLZXkiOiIxMTkzMTYwNDYiLCJ1c2VkQXV0aEVsZW1lbnRzIjoiUEFTU1dPUkQsVFJVU1RFRF9ERVZJQ0UiLCJzdHJvbmdBdXRoIjoiZmFsc2UiLCJ1c2VySWQiOiIxMjM4MDExIiwidXNlcm5hbWUiOiJ1c2VyMTIzODAxMSJ9.bpJv7hDCdobrkdVUc3drW7rjtlGT0F-sKUdI73OZpeWil95fjvLqLHIOOFSAUCRkjdFH2_hbU9-cgMAD1ItoqXV2duE9NI9lohvLGLqnHCnMzttm7Ldaq4vPU6KLvQ2dOCZkn_i9Ef6AStVN8fz9_MIniWSby9jNZDcQOk26Ua8laUyqmAIygO4nRSVTf_7brzErUUEz7ZMP5CLliuQb6tAHEiylMSHJ6iwCcwWJaVjXgXZpxV3JKJpW-udx8OBYwkSrz_-ExS1sCrTRkkg_l_eHJapLegru8tN95lzebItYX6ipc4U_qpye3ar8ddGYVFyDby3r57MjBV4RgUkUFw

refresh: eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1OGIwZDk2Ny04OTM4LTQwNGMtOWY0Zi0zOTA5ZWQxNTNiYWEifQ.eyJleHAiOjE2NTk4NjgzNTgsImlhdCI6MTY1OTg2NDc1OCwianRpIjoiYTZlMTFiYTgtNGZjYi00NDI4LTljNmUtZTVlODVhMGEwOGI2IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50LmJvZy5nZS9hdXRoL3JlYWxtcy9ib2ciLCJhdWQiOiJodHRwczovL2FjY291bnQuYm9nLmdlL2F1dGgvcmVhbG1zL2JvZyIsInN1YiI6ImY6MjdjZDkwNGYtNWNjNi00NmM0LTk5ZTktZDk0MDdkNjFhNWNlOjEyMzgwMTEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoicmlid2ViIiwic2Vzc2lvbl9zdGF0ZSI6IjMxYzA3YzJkLWMyODgtNDk3Zi1hYjA4LTliNGZiZjQ3NDUyYSIsInNjb3BlIjoib3BlbmlkIG1vYmlsZS1zc28tc2NvcGUgcmJfbWlkZGxld2FyZV9zY29wZSIsInNpZCI6IjMxYzA3YzJkLWMyODgtNDk3Zi1hYjA4LTliNGZiZjQ3NDUyYSJ9.M7m8-HMDXuPXd9Z1ydb39jxOyCiNyqyGpT3UjlWo6rU




*/
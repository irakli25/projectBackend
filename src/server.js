const Koa = require('koa');
const koaredis = require('koa-redis');
const cors =  require('@koa/cors');
const config = require('config');
const router = require('./routes');
const env = require('dotenv');
env.config();
const Redis = require('ioredis');
const db = require('./db');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');

(async () => {
const app = new Koa();
app.context.models = await db.initializeDb();
const redis = new Redis({
  host: 'localhost',
  posrt: 6379
});
const redisStore = new koaredis({
  client: redis
})
app.use(cors({
  credentials: true
}))
app.use(bodyParser());
app.use(json());
app.use(router.allowedMethods()).use(router.middleware());
app.listen(3000);
console.log(`server started on port 3000`);
})();
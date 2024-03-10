const IORedis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST ;
const REDIS_PORT = process.env.REDIS_PORT ;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ;
const redisClient = new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    username:'default',
    password: REDIS_PASSWORD,
});
const redisPublisher = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });
  
  const redisSubscriber = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });
module.exports = {redisClient , redisPublisher , redisSubscriber};  
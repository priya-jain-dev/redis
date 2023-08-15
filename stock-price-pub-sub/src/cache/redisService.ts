import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "") || 6379,
};

export const redisSub = new Redis(redisConfig);
export const redisPub = new Redis(redisConfig);

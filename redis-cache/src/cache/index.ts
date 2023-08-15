import { redis } from "../config";
import Redis from "ioredis";

// const redisClient = new Redis(redis.port, redis.host, {
//   password: redis.password,
// });
// console.log(redis.port, redis.host);

const redisClient = new Redis({
  port: 6379,
  host: "127.0.0.1",
});
// If the Node process ends, close the Cache connection
process.on("SIGINT", async () => {
  await redisClient.quit();
});

export default redisClient;

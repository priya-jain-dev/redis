import express from "express";
import {
  createTokenBucket,
  TokenBucketOptions,
} from "../token-bucket-limiter/token-bucket"; // Update the import path to match your actual tokenBucket module

const tokenBucketOptions: TokenBucketOptions = {
  capacity: 10,
  refillAmount: 10,
  refillTime: 20, //seconds
};

const tokenBucket = createTokenBucket(tokenBucketOptions);

export function tokenBucketMiddleware() {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const key = "user:" + req.ip; // Use the client's IP address as the key
    const accepted = await tokenBucket.handleRequest(key);
    if (accepted) {
      next();
    } else {
      res.status(429).send("Too Many Requests");
    }
  };
}

import Redis from "ioredis";

interface TokenBucketData {
  tokens: number;
  ts: number;
}

export interface TokenBucketOptions {
  capacity: number;
  refillAmount: number;
  refillTime: number;
}

async function refillBucket(
  client: Redis,
  key: string,
  capacity: number,
  refillAmount: number,
  refillTime: number
): Promise<TokenBucketData | null> {
  const reply = await client.hgetall(key);

  if (!reply) {
    return null;
  }

  const { tokens, ts } = reply;
  const currentTime = Date.now();
  const elapsedTime = Math.floor(
    (currentTime - parseInt(ts)) / (refillTime * 1000)
  );

  const newTokens = elapsedTime * refillAmount;
  const updatedTokens = Math.min(capacity, parseInt(tokens) + newTokens);

  await client.hmset(key, "tokens", updatedTokens, "ts", currentTime);

  return { tokens: updatedTokens, ts: currentTime };
}

async function createBucket(
  client: Redis,
  key: string,
  capacity: number
): Promise<TokenBucketData> {
  const bucket = client.hgetall(key);
  if (!bucket) {
    const currentTime = Date.now();
    await client.hmset(key, "tokens", capacity, "ts", currentTime);

    return { tokens: capacity, ts: currentTime };
  } else {
    return bucket as unknown as TokenBucketData;
  }
}

async function handleRequest(
  client: Redis,
  key: string,
  capacity: number,
  refillAmount: number,
  refillTime: number
): Promise<boolean> {
  const bucket = await createBucket(client, key, capacity);
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - bucket.ts) / 1000);

  if (elapsedTime >= refillTime) {
    const refilledBucket = await refillBucket(
      client,
      key,
      capacity,
      refillAmount,
      refillTime
    );
    if (!refilledBucket) {
      console.log(`Request[REJECTED] for ${key} -- BUCKET NOT FOUND\n`);
      return false;
    }
    bucket.tokens = refilledBucket.tokens;
  } else {
    if (bucket.tokens <= 0) {
      console.log(
        `Request[REJECTED] for ${key} (tokens - ${
          bucket.tokens
        }) -- ${new Date().toLocaleTimeString()}\n`
      );
      return false;
    }
  }

  console.log(
    `Request[ACCEPTED] for ${key} (tokens - ${
      bucket.tokens
    }) -- ${new Date().toLocaleTimeString()}\n`
  );
  await client.hset(key, "tokens", bucket.tokens - 1);

  return true;
}

export function createTokenBucket(options: TokenBucketOptions) {
  const client = new Redis(); // Initialize the ioredis client here

  return {
    refillBucket: (key: string) =>
      refillBucket(
        client,
        key,
        options.capacity,
        options.refillAmount,
        options.refillTime
      ),
    createBucket: (key: string) => createBucket(client, key, options.capacity),
    handleRequest: (key: string) =>
      handleRequest(
        client,
        key,
        options.capacity,
        options.refillAmount,
        options.refillTime
      ),
  };
}

const Redis = require("ioredis");

const streamKey = process.env.STREAM || "jarless-1";

const redis = new Redis();

async function getData() {
  let lastId = "0";
  const sleepMs = 5000;

  while (true) {
    try {
      const resp = await redis.xread(
        "BLOCK",
        sleepMs,
        "STREAMS",
        streamKey,
        lastId
      );

      if (resp) {
        const [key, messages] = resp[0];
        const [messageId, data] = messages[0];
        lastId = messageId;

        console.log("REDIS ID:", lastId);
        console.log("      -->", data);
      }
    } catch (e) {
      console.error("ERROR REDIS CONNECTION:", e);
    }
  }
}

getData();

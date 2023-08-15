const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Redis = require("ioredis");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const redis = new Redis();

const streamKey = process.env.STREAM || "india-historical-moment";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

wss.on("connection", async (ws) => {
  let lastId = "0";
  const sleepMs = 5000;

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 300));
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

        const dataDict = {};
        const dataObj = JSON.parse(data[1]);
        for (const k in dataObj) {
          dataDict[k] = dataObj[k].toString();
        }
        dataDict.id = messageId;
        dataDict.key = key;
        ws.send(JSON.stringify(dataDict));
      }
    } catch (e) {
      console.error("ERROR REDIS CONNECTION:", e);
    }
  }
});

server.listen(8000, () => {
  console.log("Web server listening on port 8000");
});

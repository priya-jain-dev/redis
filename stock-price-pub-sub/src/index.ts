require("dotenv").config();

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { handleSocketConnections } from "./socketHandler";
import { redisSub } from "./cache/redisService";
import "./cache/stockPublisher";
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(
    `Server started listening on ${PORT} port - http://localhost:${PORT}`
  );
});

// Call the function to handle socket connections
handleSocketConnections(io);

// Close Redis subscription when the server is shut down
process.on("SIGINT", () => {
  redisSub.quit();
  process.exit();
});

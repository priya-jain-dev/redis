import express from "express";
import http from "http";
import socketIo from "socket.io";
import Redis from "ioredis";

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server);

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

setInterval(() => {
  const companies = ["AAPL", "GOOGL", "AMZN", "TSLA"];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const price = (Math.random() * 1000).toFixed(2);

  // Publish the message using a separate Redis client
  const publisher = new Redis({
    host: "localhost",
    port: 6379,
  });
  publisher.publish(
    `stock-price-${company}`,
    JSON.stringify({ company, price })
  );
  publisher.quit();
}, 2000);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("subscribeToCompany", (company: string) => {
    redis.subscribe(`stock-price-${company}`);
    redis.on("message", (channel, message) => {
      if (channel === `stock-price-${company}`) {
        socket.emit("stockPriceUpdate", JSON.parse(message));
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

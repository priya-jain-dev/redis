import { Server as SocketIOServer, Socket } from "socket.io";
import { redisSub } from "./cache/redisService";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
} from "./cache/stockSubscribe";

export const handleSocketConnections = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("A new user get connected!");
    let subscribedChannel: string;

    socket.on("subscribeToCompany", (company: string) => {
      const channel = `stock-price-${company}`;
      subscribedChannel = channel;

      redisSub.subscribe(`stock-price-${company}`);

      subscribeToChannel(channel, (channel, message) => {
        messageHandler(channel, message, company, socket);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected!");
        unsubscribeFromChannel(subscribedChannel);
      });
    });
    // Additional cleanup on socket disconnect
    socket.on("disconnect", () => {
      if (subscribedChannel) {
        unsubscribeFromChannel(subscribedChannel);
      }
    });
  });
};

const messageHandler = (
  channel: string,
  message: string,
  company: string,
  socket: Socket
) => {
  if (channel === `stock-price-${company}`) {
    socket.emit("stockPriceUpdate", JSON.parse(message));
  }
};

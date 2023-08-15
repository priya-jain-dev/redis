import { redisSub } from "./redisService";

export const subscribeToChannel = (
  channel: string,
  callback: (channel: string, message: string) => void
) => {
  redisSub.subscribe(channel);

  const onMessage = (ch: string, msg: string) => {
    if (ch === channel) {
      callback(ch, msg);
    }
  };

  redisSub.on("message", onMessage);
};

export const unsubscribeFromChannel = (channel: string) => {
  redisSub.unsubscribe(channel);
};

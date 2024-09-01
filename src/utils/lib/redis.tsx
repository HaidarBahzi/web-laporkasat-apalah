import { createClient, RedisClientType } from "redis";

const redisClientSingleton = () => {
  const client = createClient();
  client.on("error", (err) => console.error("Redis Client Error", err));
  return client;
};

declare const globalThis: {
  redisGlobal: RedisClientType;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

redis.connect();

export default redis;

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis;

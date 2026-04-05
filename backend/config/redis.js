const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("connect", () => {
  console.log("Redis connected...");
});

client.on("ready", () => {
  console.log("Redis is ready to use");
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = client;
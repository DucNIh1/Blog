import { createClient } from "redis";

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("connect", () => {
  console.log("Đã kết nối Redis");
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

// Kết nối Redis
client.connect();
export default client;

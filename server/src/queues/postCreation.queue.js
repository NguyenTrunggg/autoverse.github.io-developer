import Bull from "bull";
import { redisConfig } from "../config/redis";

const postCreationQueue = new Bull("post-creation-queue", {
    redis: redisConfig,
});

// BẮT LỖI REDIS
postCreationQueue.on("error", (err) => {
    console.error("❌ Redis connection error in postCreationQueue:", err);
});

export default postCreationQueue;

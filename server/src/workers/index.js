// src/workers/index.js
import { postCreationQueue } from "../queues/index.js";
import "./postCreation.worker.js";

export function initWorkers() {
    postCreationQueue.on("completed", (job, result) => {
        console.log(`Job ${job.id} done`, result);
    });

    postCreationQueue.on("failed", (job, err) => {
        console.error(`Job ${job.id} failed`, err);
    });

    console.log("Workers started ...");
}

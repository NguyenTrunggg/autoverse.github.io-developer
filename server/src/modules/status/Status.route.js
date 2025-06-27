import express from "express";

import statusController from "./Status.controller.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

const statusRoute = (app) => {
    router.get("/", statusController.getAllStatuses);

    router.get("/get-by-id/:id", statusController.getStatusById);

    router.get("/get-by-type", statusController.getStatusByType);

    router.post("/", checkUserJWT, isAdmin, statusController.createStatus);

    router.put("/:id", checkUserJWT, isAdmin, statusController.updateStatus);

    router.delete("/:id", checkUserJWT, isAdmin, statusController.deleteStatus);

    return app.use("/status", router);
};

export default statusRoute;

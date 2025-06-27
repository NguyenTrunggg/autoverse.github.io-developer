import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import { createAssigned, updateAssigned } from "./AssignedAIModel.validator.js";
import assignedAIModelController from "./AssignedAIModel.controller.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

const assignedAIModelRoute = (app) => {
    // Router gán AIModel cho người dùng
    router.get("/", checkUserJWT, isAdmin, assignedAIModelController.getAllAssigned);
    router.get("/get-by-user/:id", checkUserJWT, assignedAIModelController.getAssignedByUser);
    router.post(
        "/",
        checkUserJWT,
        isAdmin,
        validate(createAssigned),
        assignedAIModelController.createAssigned
    );
    router.put(
        "/:id",
        checkUserJWT,
        isAdmin,
        validate(updateAssigned),
        assignedAIModelController.updateAssigned
    );
    router.delete("/:id", checkUserJWT, isAdmin, assignedAIModelController.deleteAssigned);

    return app.use("/assigned-ai-model", router);
};

export default assignedAIModelRoute;

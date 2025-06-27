import express from "express";

import aiModelController from "./AIModel.controller.js";
import validate from "../../middlewares/validateMiddleware.js";
import { createAIModel, updateAIModel, updateAIModelStatus } from "./AIModel.validator.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

const aiModelRoute = (app) => {
    // Router thêm sửa xóa AIModel
    router.use(checkUserJWT);
    router.use(isAdmin);
    router.get("/", aiModelController.getAllAIModels);
    router.get("/get-by-id/:id", aiModelController.getAIModelById);
    router.post("/", validate(createAIModel), aiModelController.createAIModel);
    router.put("/:id", validate(updateAIModel), aiModelController.updateAIModel);
    router.patch(
        "/update-status/:id",
        validate(updateAIModelStatus),
        aiModelController.updateAIModelStatus
    );
    router.delete("/:id", aiModelController.deleteAIModel);

    return app.use("/ai-model", router);
};

export default aiModelRoute;

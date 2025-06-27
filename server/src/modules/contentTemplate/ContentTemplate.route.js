import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import { createConTemplate, updateConTemplate } from "./ContentTemplate.validator.js";
import contentTemplateController from "./ContentTemplate.controller.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

const conTemplateRoute = (app) => {
    router.get("/", checkUserJWT, isAdmin, contentTemplateController.getAllConTemplates);

    router.get("/get-by-id/:id", checkUserJWT, contentTemplateController.getConTemplateById);

    router.post(
        "/",
        checkUserJWT,
        validate(createConTemplate),
        contentTemplateController.createConTemplate
    );

    router.put(
        "/:id",
        checkUserJWT,
        upload.array("images", 5),
        validate(updateConTemplate),
        contentTemplateController.updateConTemplate
    );

    router.delete("/:id", checkUserJWT, contentTemplateController.deleteConTemplate);

    return app.use("/content-template", router);
};

export default conTemplateRoute;

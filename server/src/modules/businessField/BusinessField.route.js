import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import { createBusinessField, updateBusinessField } from "./BusinessField.validator.js";
import businessFieldController from "./BusinessField.controller.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

const businessRoute = (app) => {
    router.get("/", businessFieldController.getAllBusinessFields);

    router.get(
        "/get-by-id/:id",
        checkUserJWT,
        isAdmin,
        businessFieldController.getBusinessFieldById
    );

    router.post(
        "/",
        checkUserJWT,
        isAdmin,
        validate(createBusinessField),
        businessFieldController.createBusinessField
    );

    router.put(
        "/:id",
        checkUserJWT,
        isAdmin,
        validate(updateBusinessField),
        businessFieldController.updateBusinessField
    );

    router.delete("/:id", checkUserJWT, isAdmin, businessFieldController.deleteBusinessField);

    return app.use("/business-field", router);
};

export default businessRoute;

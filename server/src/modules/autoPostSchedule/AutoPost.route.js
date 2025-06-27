import express from "express";
import multer from "multer";
import path from "path";

import autoPostController from "./AutoPost.controller.js";
import validate from "../../middlewares/validateMiddleware.js";
import { create, createScheduleByExcel, createPlanExcel } from "./AutoPost.validator.js";
import { checkUserJWT } from "../../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({
    dest: path.join(__dirname, "../../public/uploads"),
});

const autoPostRoute = (app) => {
    router.post("/", checkUserJWT, validate(create), autoPostController.create);
    router.post("/test-ai", autoPostController.testAI);

    router.post(
        "/create-plan-excel",
        checkUserJWT,
        validate(createPlanExcel),
        autoPostController.createPlanExcel
    );

    router.post(
        "/create-by-excel",
        checkUserJWT,
        upload.single("file"),
        validate(createScheduleByExcel),
        autoPostController.createScheduleByExcel
    );

    return app.use("/auto-post", router);
};

export default autoPostRoute;

import express from "express";

import userController from "./User.controller.js";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

const userRoute = (app) => {
    router.get("/", checkUserJWT, isAdmin, userController.getAllUsers);

    router.get("/get-by-id/:id", userController.getUserById);

    router.post("/", checkUserJWT, isAdmin, userController.createUser);

    router.put("/:id", checkUserJWT, userController.updateUser);

    router.patch("/update-status/:id", checkUserJWT, isAdmin, userController.updateUserStatus);

    router.delete("/:id", checkUserJWT, isAdmin, userController.deleteUser);

    return app.use("/user", router);
};

export default userRoute;

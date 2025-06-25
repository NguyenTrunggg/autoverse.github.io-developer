import express from "express";

import thirdPartyAccountController from "./controllers/ThirdPartyAccount.controller";
import SocialInteController from "./controllers/SocialIntegration.controller";

const router = express.Router();

const thirdPartyAccountRoute = (app) => {
    router.get("/", thirdPartyAccountController.getAllAccounts);

    router.get("/get-by-id/:id", thirdPartyAccountController.getInforById);

    router.get("/get-by-user/:id", thirdPartyAccountController.getInforByUser);

    // router.post("/", thirdPartyAccountController.createUser);

    // router.delete("/:id", thirdPartyAccountController.deleteUser);

    router.get("/social/get-by-user/:id", SocialInteController.getInforByThirdAccId);

    return app.use("/third-account", router);
};

export default thirdPartyAccountRoute;

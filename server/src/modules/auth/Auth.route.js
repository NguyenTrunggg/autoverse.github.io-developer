import express from "express";
import passport from "passport";
require("../../config/oauth");

import authController from "./DefaultAuth/Auth.controller";
import faceAuthController from "./Facebook/controllers/FaceAuth.controller";
import googleAuthController from "./Google/GoogleAuth.controller";
import validate from "../../middlewares/validateMiddleware";
import { handleLogin, handleRegister } from "./Auth.validator";
import { checkUserJWT } from "../../middlewares/authMiddleware";

const router = express.Router();

const authRoute = (app) => {
    // Route xử lý login default, đăng ký và đăng xuất
    router.post("/login", validate(handleLogin), authController.handleLogin);
    router.post("/register", validate(handleRegister), authController.handleRegister);
    router.get("/logout", authController.handleLogout);
    router.post("/refresh-token", authController.refreshToken);
    router.post("/get-me", checkUserJWT, authController.refreshToken);

    // Route xử lý tác vụ facebook
    router.get("/facebook", faceAuthController.redirectToFacebookLogin);
    router.get("/facebook/login-callback", faceAuthController.handleFaceLoginCallback);

    router.get("/facebook/connect", faceAuthController.redirectToFacebookConnect);
    router.get("/facebook/connect-callback", faceAuthController.handleFaceConnectCallback);
    router.post("/facebook/post", faceAuthController.publishPostToPage);

    // Route xử lý Đăng nhập Google
    router.get(
        "/google",
        passport.authenticate("google", {
            scope: ["profile", "email"],
            prompt: "select_account",
        })
    );

    router.get(
        "/google/callback",
        passport.authenticate("google", {
            session: false,
            failureRedirect: "/login",
        }),
        googleAuthController.loginCallback
    );

    return app.use("/auth", router);
};

export default authRoute;

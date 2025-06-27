import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import {
    createUserPromotion,
    updateUserPromotion,
    createPromotionUsage,
    updatePromotionUsage,
} from "./Promotion.validator";
import userPromotionController from "./controllers/UserPromotion.controller";
import promotionUsageController from "./controllers/PromotionUsage.controller";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware";

const router = express.Router();

const promotionRoute = (app) => {
    // Gói khuyến mãi của từng người dùng (bảng user_promotions)
    router.get("/users", userPromotionController.getAllUserPromotions);
    router.get("/users/get-by-id/:id", userPromotionController.getUserPromotionById);
    router.post(
        "/users",
        checkUserJWT,
        isAdmin,
        validate(createUserPromotion),
        userPromotionController.createUserPromotion
    );
    router.put(
        "/users/:id",
        checkUserJWT,
        isAdmin,
        validate(updateUserPromotion),
        userPromotionController.updateUserPromotion
    );
    router.delete("/users/:id", checkUserJWT, isAdmin, userPromotionController.deleteUserPromotion);

    // Lịch sử sử dụng khuyến mãi (bảng promotion_usages)
    router.get("/usages", promotionUsageController.getAllPromotionUsages);
    router.get("/usages/get-by-id/:id", promotionUsageController.getPromotionUsageById);
    router.post(
        "/usages",
        checkUserJWT,
        isAdmin,
        validate(createPromotionUsage),
        promotionUsageController.createPromotionUsage
    );
    router.put(
        "/usages/:id",
        checkUserJWT,
        isAdmin,
        validate(updatePromotionUsage),
        promotionUsageController.updatePromotionUsage
    );
    router.delete(
        "/usages/:id",
        checkUserJWT,
        isAdmin,
        promotionUsageController.deletePromotionUsage
    );

    return app.use("/promotion", router);
};

export default promotionRoute;

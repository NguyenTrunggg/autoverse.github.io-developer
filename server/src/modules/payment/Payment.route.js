import express from "express";

import validate from "../../middlewares/validateMiddleware";
import {
    createPayment,
    updatePayment,
    updatePaymentStatus,
    createMethodPay,
    updateMethodPay,
    updateMethodPayStatus,
    createGateway,
    updateGateway,
    updateGatewayStatus,
} from "./Payment.validator";
import paymentController from "./controllers/Payment.controller";
import paymentGateWayController from "./controllers/PaymentGateWay.controller";
import paymentMethodController from "./controllers/PaymentMethod.controller";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware";

const router = express.Router();

const paymentRoute = (app) => {
    // Router thanh toán
    router.get("/", checkUserJWT, isAdmin, paymentController.getAllPayments);
    router.get("/get-by-id/:id", checkUserJWT, paymentController.getPaymentById);
    router.get("/get-by-user/:id", checkUserJWT, paymentController.getPaymentByUser);
    router.post("/", checkUserJWT, validate(createPayment), paymentController.createPayment);
    router.put(
        "/:id",
        checkUserJWT,
        isAdmin,
        validate(updatePayment),
        paymentController.updatePayment
    );
    router.patch(
        "/update-status/:id",
        checkUserJWT,
        isAdmin,
        validate(updatePaymentStatus),
        paymentController.updatePaymentStatus
    );
    router.delete("/:id", checkUserJWT, isAdmin, paymentController.deletePayment);

    // Router phương thức thanh toán
    router.get("/method", paymentMethodController.getAllMethodPays);
    router.get(
        "/method/get-by-id/:id",
        checkUserJWT,
        isAdmin,
        paymentMethodController.getMethodPayById
    );
    router.post(
        "/method",
        checkUserJWT,
        isAdmin,
        validate(createMethodPay),
        paymentMethodController.createMethodPay
    );
    router.put(
        "/method/:id",
        checkUserJWT,
        isAdmin,
        validate(updateMethodPay),
        paymentMethodController.updateMethodPay
    );
    router.patch(
        "/method/update-status/:id",
        checkUserJWT,
        isAdmin,
        validate(updateMethodPayStatus),
        paymentMethodController.updateMethodPayStatus
    );
    router.delete("/method/:id", checkUserJWT, isAdmin, paymentMethodController.deleteMethodPay);

    // Router Cổng thanh toán
    router.get("/gateway", paymentGateWayController.getAllGateways);
    router.get(
        "/gateway/get-by-id/:id",
        checkUserJWT,
        isAdmin,
        paymentGateWayController.getGatewayById
    );
    router.post(
        "/gateway",
        checkUserJWT,
        isAdmin,
        validate(createGateway),
        paymentGateWayController.createGateway
    );
    router.put(
        "/gateway/:id",
        checkUserJWT,
        isAdmin,
        validate(updateGateway),
        paymentGateWayController.updateGateway
    );
    router.patch(
        "/gateway/update-status/:id",
        checkUserJWT,
        isAdmin,
        validate(updateGatewayStatus),
        paymentGateWayController.updateGatewayStatus
    );
    router.delete("/gateway/:id", checkUserJWT, isAdmin, paymentGateWayController.deleteGateway);

    return app.use("/payment", router);
};

export default paymentRoute;

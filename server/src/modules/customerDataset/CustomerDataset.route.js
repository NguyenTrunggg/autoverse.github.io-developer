import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import {
    createCustomerDataset,
    updateCustomerDataset,
    updateCustomerDatasetStatus,
} from "./CustomerDataset.validator";
import customerDatasetController from "./CustomerDataset.controller";
import { checkUserJWT } from "../../middlewares/authMiddleware";

const router = express.Router();

const cusDatasetRoute = (app) => {
    router.get("/", customerDatasetController.getAllCustomerDatasets);

    router.get("/get-by-id/:id", customerDatasetController.getCustomerDatasetById);

    router.post(
        "/",
        checkUserJWT,
        validate(createCustomerDataset),
        customerDatasetController.createCustomerDataset
    );

    router.put(
        "/:id",
        checkUserJWT,
        validate(updateCustomerDataset),
        customerDatasetController.updateCustomerDataset
    );

    router.patch(
        "/update-status/:id",
        checkUserJWT,
        validate(updateCustomerDatasetStatus),
        customerDatasetController.updateCustomerDatasetStatus
    );

    router.delete("/:id", checkUserJWT, customerDatasetController.deleteCustomerDataset);

    return app.use("/customer-dataset", router);
};

export default cusDatasetRoute;

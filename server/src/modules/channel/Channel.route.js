import express from "express";

import validate from "../../middlewares/validateMiddleware.js";
import {
    createChannel,
    updateChannel,
    updateChannelStatus,
    createChannelType,
    updateChannelType,
    updateChannelTypeStatus,
} from "./Channel.validator";
import channelController from "./controllers/Channel.controller";
import channelTypeController from "./controllers/ChannelType.controller";
import { checkUserJWT, isAdmin } from "../../middlewares/authMiddleware";

const router = express.Router();

const channelRoute = (app) => {
    // Router Channel
    router.get("/", channelController.getAllChannels);
    router.get("/get-by-id/:id", channelController.getChannelById);
    router.post(
        "/",
        checkUserJWT,
        isAdmin,
        validate(createChannel),
        channelController.createChannel
    );
    router.put(
        "/:id",
        checkUserJWT,
        isAdmin,
        validate(updateChannel),
        channelController.updateChannel
    );
    router.patch(
        "/update-status/:id",
        checkUserJWT,
        isAdmin,
        validate(updateChannelStatus),
        channelController.updateChannelStatus
    );
    router.delete("/:id", checkUserJWT, isAdmin, channelController.deleteChannel);

    // Router Channel Type
    router.get("/type", channelTypeController.getAllChannelTypes);
    router.get("/type/get-by-id/:id", channelTypeController.getChannelTypeById);
    router.post(
        "/type",
        checkUserJWT,
        isAdmin,
        validate(createChannelType),
        channelTypeController.createChannelType
    );
    router.put(
        "/type/:id",
        checkUserJWT,
        isAdmin,
        validate(updateChannelType),
        channelTypeController.updateChannelType
    );
    router.patch(
        "/type/update-status/:id",
        checkUserJWT,
        isAdmin,
        validate(updateChannelTypeStatus),
        channelTypeController.updateChannelTypeStatus
    );
    router.delete("/type/:id", checkUserJWT, isAdmin, channelTypeController.deleteChannelType);

    return app.use("/channel", router);
};

export default channelRoute;

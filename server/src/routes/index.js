import aiModelRoute from "../modules/aiModel/AIModel.route.js";
import asignedAIModelRoute from "../modules/assignedAIModel/AssignedAIModel.route.js";
import authRoute from "../modules/auth/Auth.route.js";
import businessRoute from "../modules/businessField/BusinessField.route.js";
import channelRoute from "../modules/channel/Channel.route.js";
import conTemplateRoute from "../modules/contentTemplate/ContentTemplate.route.js";
import cusDatasetRoute from "../modules/customerDataset/CustomerDataset.route.js";
import paymentRoute from "../modules/payment/Payment.route.js";
import promotionRoute from "../modules/promotion/Promotion.route.js";
import statusRoute from "../modules/status/Status.route.js";
import userRoute from "../modules/user/User.route.js";
import thirdPartyAccountRoute from "../modules/thirdPartyAccount/ThirdPartyAccount.route.js";
import postRoute from "../modules/post/Post.route.js";
import autoPostRoute from "../modules/autoPostSchedule/AutoPost.route.js";

import logMiddleware from "../middlewares/logMiddleware.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const appRoute = (app) => {
    app.use(logMiddleware);

    app.get("/", (req, res) => {
        res.status(200).json({
            message: "Welcome to the OpenAI API server",
        });
    });

    aiModelRoute(app);
    asignedAIModelRoute(app);
    authRoute(app);
    businessRoute(app);
    channelRoute(app);
    conTemplateRoute(app);
    cusDatasetRoute(app);
    paymentRoute(app);
    promotionRoute(app);
    statusRoute(app);
    userRoute(app);
    thirdPartyAccountRoute(app);
    postRoute(app);
    autoPostRoute(app);

    app.use(errorMiddleware.notFoundHandler);
    app.use(errorMiddleware.errorHandler);
};

export default appRoute;

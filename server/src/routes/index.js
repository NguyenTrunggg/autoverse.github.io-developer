import aiModelRoute from "../modules/aiModel/AIModel.route";
import asignedAIModelRoute from "../modules/assignedAIModel/AssignedAIModel.route";
import authRoute from "../modules/auth/Auth.route";
import businessRoute from "../modules/businessField/BusinessField.route";
import channelRoute from "../modules/channel/Channel.route";
import conTemplateRoute from "../modules/contentTemplate/ContentTemplate.route";
import cusDatasetRoute from "../modules/customerDataset/CustomerDataset.route";
import paymentRoute from "../modules/payment/Payment.route";
import promotionRoute from "../modules/promotion/Promotion.route";
import statusRoute from "../modules/status/Status.route";
import userRoute from "../modules/user/User.route";
import thirdPartyAccountRoute from "../modules/thirdPartyAccount/ThirdPartyAccount.route";
import postRoute from "../modules/post/Post.route";
import autoPostRoute from "../modules/autoPostSchedule/AutoPost.route";

import logMiddleware from "../middlewares/logMiddleware";
import errorMiddleware from "../middlewares/errorMiddleware";

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

import AppDataSource from "./database.js";

import UserSchema from "../modules/user/User.entity.js";
import StatusSchema from "../modules/status/Status.entity.js";
import RoleSchema from "../modules/role/Role.entity.js";
import BusinessFieldSchema from "../modules/businessField/BusinessField.entity.js";
import AIModelSchema from "../modules/aiModel/AIModel.entity.js";
import ContentTemplateSchema from "../modules/contentTemplate/entities/ContentTemplate.entity.js";
import ConTemplateImage from "../modules/contentTemplate/entities/ContentTemplateImage.entity.js";
import ChannelTypeSchema from "../modules/channel/entities/ChannelType.entity.js";
import ChannelSchema from "../modules/channel/entities/Channel.entity.js";
import CustomerDatasetSchema from "../modules/customerDataset/CustomerDataset.entity.js";
import PaymentMethodSchema from "../modules/payment/entities/PaymentMethod.entity.js";
import PaymentSchema from "../modules/payment/entities/Payment.entity.js";
import PaymentGatewaySchema from "../modules/payment/entities/PaymentGateway.entity.js";
import UserPromotionSchema from "../modules/promotion/entities/UserPromotion.entity.js";
import PromotionUsageSchema from "../modules/promotion/entities/PromotionUsage.entity.js";
import AssignedAIModelSchema from "../modules/assignedAIModel/AssignedAIModel.entity.js";
import ChatbotInteractionSchema from "../modules/chatbotInteraction/ChatbotInteraction.entity.js";
import MessageSchema from "../modules/message/Message.entity.js";
import PostSchema from "../modules/post/Post.entity.js";
import ThirdPartyAccountSchema from "../modules/thirdPartyAccount/entities/ThirdPartyAccount.entity.js";
import SocialIntegrationSchema from "../modules/thirdPartyAccount/entities/SocialIntegration.entity.js";

const repositories = {
    user: AppDataSource.getRepository(UserSchema),
    status: AppDataSource.getRepository(StatusSchema),
    role: AppDataSource.getRepository(RoleSchema),
    businessField: AppDataSource.getRepository(BusinessFieldSchema),
    aiModel: AppDataSource.getRepository(AIModelSchema),
    conTemplate: AppDataSource.getRepository(ContentTemplateSchema),
    conTemplateImage: AppDataSource.getRepository(ConTemplateImage),
    channelType: AppDataSource.getRepository(ChannelTypeSchema),
    channel: AppDataSource.getRepository(ChannelSchema),
    cusDataset: AppDataSource.getRepository(CustomerDatasetSchema),
    methodPay: AppDataSource.getRepository(PaymentMethodSchema),
    payment: AppDataSource.getRepository(PaymentSchema),
    paymentGate: AppDataSource.getRepository(PaymentGatewaySchema),
    userPromotion: AppDataSource.getRepository(UserPromotionSchema),
    promotionUsage: AppDataSource.getRepository(PromotionUsageSchema),
    assignedAIModel: AppDataSource.getRepository(AssignedAIModelSchema),
    chatInterac: AppDataSource.getRepository(ChatbotInteractionSchema),
    message: AppDataSource.getRepository(MessageSchema),
    post: AppDataSource.getRepository(PostSchema),
    thirdAccount: AppDataSource.getRepository(ThirdPartyAccountSchema),
    socialIntegration: AppDataSource.getRepository(SocialIntegrationSchema),
};

export default repositories;

import AppDataSource from "./database";

import UserSchema from "../modules/user/User.entity";
import StatusSchema from "../modules/status/Status.entity";
import RoleSchema from "../modules/role/Role.entity";
import BusinessFieldSchema from "../modules/businessField/BusinessField.entity";
import AIModelSchema from "../modules/aiModel/AIModel.entity";
import ContentTemplateSchema from "../modules/contentTemplate/entities/ContentTemplate.entity";
import ConTemplateImage from "../modules/contentTemplate/entities/ContentTemplateImage.entity";
import ChannelTypeSchema from "../modules/channel/entities/ChannelType.entity";
import ChannelSchema from "../modules/channel/entities/Channel.entity";
import CustomerDatasetSchema from "../modules/customerDataset/CustomerDataset.entity";
import PaymentMethodSchema from "../modules/payment/entities/PaymentMethod.entity";
import PaymentSchema from "../modules/payment/entities/Payment.entity";
import PaymentGatewaySchema from "../modules/payment/entities/PaymentGateway.entity";
import UserPromotionSchema from "../modules/promotion/entities/UserPromotion.entity";
import PromotionUsageSchema from "../modules/promotion/entities/PromotionUsage.entity";
import AssignedAIModelSchema from "../modules/assignedAIModel/AssignedAIModel.entity";
import ChatbotInteractionSchema from "../modules/chatbotInteraction/ChatbotInteraction.entity";
import MessageSchema from "../modules/message/Message.entity";
import PostSchema from "../modules/post/Post.entity";
import ThirdPartyAccountSchema from "../modules/thirdPartyAccount/entities/ThirdPartyAccount.entity";
import SocialIntegrationSchema from "../modules/thirdPartyAccount/entities/SocialIntegration.entity";

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

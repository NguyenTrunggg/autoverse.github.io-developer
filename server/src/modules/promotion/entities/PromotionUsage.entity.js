import { EntitySchema } from "typeorm";
import PromotionUsage from "../models/PromotionUsage.model.js";

const PromotionUsageSchema = new EntitySchema({
    name: "PromotionUsage",
    tableName: "promotion_usages",
    target: PromotionUsage,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        serviceType: {
            type: "enum",
            enum: ["post", "email", "chatbot", "zalo", "facebook_msg"],
            nullable: false,
        },
        usageDate: {
            type: "date",
            nullable: false,
        },
        count: {
            type: "int",
            nullable: false,
            default: 0,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
        promotion: {
            type: "many-to-one",
            target: "UserPromotion",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default PromotionUsageSchema;

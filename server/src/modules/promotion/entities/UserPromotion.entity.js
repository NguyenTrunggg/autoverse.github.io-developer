import { EntitySchema } from "typeorm";
import UserPromotion from "../models/UserPromotion.model.js";

const UserPromotionSchema = new EntitySchema({
    name: "UserPromotion",
    tableName: "user_promotions",
    target: UserPromotion,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        startDate: {
            type: "date",
            nullable: false,
        },
        endDate: {
            type: "date",
            nullable: false,
        },
        note: {
            type: "text",
            nullable: true,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
        aiModel: {
            type: "many-to-one",
            target: "AIModel",
            joinColumn: true,
            nullable: false,
        },
        usages: {
            type: "one-to-many",
            target: "PromotionUsage",
            inverseSide: "promotion",
        },
    },
});

export default UserPromotionSchema;

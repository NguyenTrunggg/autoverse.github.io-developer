import { EntitySchema } from "typeorm";
import User from "./User.model.js";

const UserSchema = new EntitySchema({
    name: "User",
    tableName: "users",
    target: User,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        phone: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        address: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: false,
            select: false,
        },
        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        deletedAt: {
            name: "deleted_at",
            type: "datetime",
            nullable: true,
            precision: 6,
            deleteDate: true,
        },
        loginProvider: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        providerId: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
    },
    uniques: [
        {
            name: "UQ_loginProvider_providerId",
            columns: ["loginProvider", "providerId"],
        },
    ],
    relations: {
        role: {
            type: "many-to-one",
            target: "Role",
            joinColumn: true,
            nullable: false,
        },
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
        templates: {
            type: "one-to-many",
            target: "ContentTemplate",
            inverseSide: "user",
        },
        posts: {
            type: "one-to-many",
            target: "Post",
            inverseSide: "user",
        },
        messages: {
            type: "one-to-many",
            target: "Message",
            inverseSide: "user",
        },
        chatbotInteractions: {
            type: "one-to-many",
            target: "ChatbotInteraction",
            inverseSide: "user",
        },
        payments: {
            type: "one-to-many",
            target: "Payment",
            inverseSide: "user",
        },
        datasets: {
            type: "one-to-many",
            target: "CustomerDataset",
            inverseSide: "user",
        },
        promotions: {
            type: "one-to-many",
            target: "UserPromotion",
            inverseSide: "user",
        },
        assignedAIModels: {
            type: "one-to-many",
            target: "AssignedAIModel",
            inverseSide: "user",
        },
    },
});

export default UserSchema;

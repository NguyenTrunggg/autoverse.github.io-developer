import { EntitySchema } from "typeorm";
import AIModel from "./AIModel.model.js";

const AIModelSchema = new EntitySchema({
    name: "AIModel",
    tableName: "ai_models",
    target: AIModel,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        apiKey: {
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
    },
    relations: {
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
        templates: {
            type: "one-to-many",
            target: "ContentTemplate",
            inverseSide: "aiModel",
        },
        chatbotInteractions: {
            type: "one-to-many",
            target: "ChatbotInteraction",
            inverseSide: "aiModel",
        },
        datasets: {
            type: "one-to-many",
            target: "CustomerDataset",
            inverseSide: "aiModel",
        },
        promotions: {
            type: "one-to-many",
            target: "UserPromotion",
            inverseSide: "aiModel",
        },
        assignedUsers: {
            type: "one-to-many",
            target: "AssignedAIModel",
            inverseSide: "aiModel",
        },
    },
});

export default AIModelSchema;

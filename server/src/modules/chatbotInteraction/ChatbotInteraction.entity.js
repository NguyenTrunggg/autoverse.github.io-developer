import { EntitySchema } from "typeorm";
import ChatbotInteraction from "./ChatbotInteraction.model.js";

const ChatbotInteractionSchema = new EntitySchema({
    name: "ChatbotInteraction",
    tableName: "chatbot_interactions",
    target: ChatbotInteraction,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        message: {
            type: "text",
            nullable: false,
        },
        response: {
            type: "text",
            nullable: false,
        },
        timestamp: {
            type: "datetime",
            createdAt: true,
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
    },
});

export default ChatbotInteractionSchema;

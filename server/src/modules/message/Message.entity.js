import { EntitySchema } from "typeorm";
import Message from "./Message.model.js";

const MessageSchema = new EntitySchema({
    name: "Message",
    tableName: "messages",
    target: Message,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        content: {
            type: "text",
            nullable: false,
        },
        sentTime: {
            type: "datetime",
            nullable: false,
        },
        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
        channel: {
            type: "many-to-one",
            target: "Channel",
            joinColumn: true,
            nullable: false,
        },
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default MessageSchema;

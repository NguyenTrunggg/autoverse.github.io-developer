import { EntitySchema } from "typeorm";
import Channel from "../models/Channel.model.js";

const ChannelSchema = new EntitySchema({
    name: "Channel",
    tableName: "channels",
    target: Channel,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        apiEndpoint: {
            type: "text",
            nullable: false,
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
        channelType: {
            type: "many-to-one",
            target: "ChannelType",
            joinColumn: true,
            nullable: false,
        },
        posts: {
            type: "one-to-many",
            target: "Post",
            inverseSide: "channel",
        },
        messages: {
            type: "one-to-many",
            target: "Message",
            inverseSide: "channel",
        },
    },
});

export default ChannelSchema;

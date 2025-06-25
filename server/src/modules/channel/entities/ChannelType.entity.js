import { EntitySchema } from "typeorm";
import ChannelType from "../models/ChannelType.model.js";

const ChannelTypeSchema = new EntitySchema({
    name: "ChannelType",
    tableName: "channel_types",
    target: ChannelType,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 50,
            nullable: false,
            unique: true,
        },
    },
    relations: {
        channels: {
            type: "one-to-many",
            target: "Channel",
            inverseSide: "channelType",
        },
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default ChannelTypeSchema;

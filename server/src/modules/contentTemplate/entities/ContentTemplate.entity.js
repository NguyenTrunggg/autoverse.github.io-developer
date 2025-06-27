import { EntitySchema } from "typeorm";
import ContentTemplate from "../models/ContentTemplate.model.js";

const ContentTemplateSchema = new EntitySchema({
    name: "ContentTemplate",
    tableName: "content_templates",
    target: ContentTemplate,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        body: {
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
        posts: {
            type: "one-to-many",
            target: "Post",
            inverseSide: "template",
        },
        images: {
            type: "one-to-many",
            target: "ContentTemplateImage",
            inverseSide: "template",
            cascade: true,
        },
    },
});

export default ContentTemplateSchema;

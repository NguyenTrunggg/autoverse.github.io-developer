import { EntitySchema } from "typeorm";
import ContentTemplateImage from "../models/ContentTemplateImage.model";

const ContentTemplateImageSchema = new EntitySchema({
    name: "ContentTemplateImage",
    tableName: "content_template_images",
    target: ContentTemplateImage,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        imageUrl: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        template: {
            type: "many-to-one",
            target: "ContentTemplate",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default ContentTemplateImageSchema;

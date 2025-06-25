import { EntitySchema } from "typeorm";
import Post from "./Post.model.js";

const PostSchema = new EntitySchema({
    name: "Post",
    tableName: "posts",
    target: Post,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        scheduledDate: {
            type: "date",
            nullable: false,
        },
        scheduledHour: {
            type: "time",
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
        template: {
            type: "many-to-one",
            target: "ContentTemplate",
            joinColumn: true,
            nullable: false,
        },
        channel: {
            type: "many-to-one",
            target: "Channel",
            joinColumn: true,
            nullable: false,
        },
        socialIntegration: {
            type: "many-to-one",
            target: "SocialIntegration",
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

export default PostSchema;

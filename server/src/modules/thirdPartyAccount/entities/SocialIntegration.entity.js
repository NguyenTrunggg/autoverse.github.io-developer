import { EntitySchema } from "typeorm";
import SocialIntegration from "../models/SocialIntegration.model";

const SocialIntegrationSchema = new EntitySchema({
    name: "SocialIntegration",
    tableName: "social_integrations",
    target: SocialIntegration,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        thirdPartyAccountId: {
            type: "int",
            nullable: false,
        },
        provider: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        integrationId: {
            type: "varchar",
            length: 150,
            nullable: false,
        },
        integrationName: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        accessToken: {
            type: "text",
            nullable: false,
        },
        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        thirdPartyAccount: {
            type: "many-to-one",
            target: "ThirdPartyAccount",
            joinColumn: true,
            nullable: false,
        },
        posts: {
            type: "one-to-many",
            target: "Post",
            inverseSide: "socialIntegration",
        },
    },
    uniques: [
        {
            name: "UQ_thirdPartyAccount_integrationId",
            columns: ["thirdPartyAccountId", "integrationId"],
        },
    ],
});

export default SocialIntegrationSchema;

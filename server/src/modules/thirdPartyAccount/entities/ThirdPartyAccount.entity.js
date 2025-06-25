import { EntitySchema } from "typeorm";
import ThirdPartyAccount from "../models/ThirdPartyAccount.model.js";

const ThirdPartyAccountSchema = new EntitySchema({
    name: "ThirdPartyAccount",
    tableName: "third_party_accounts",
    target: ThirdPartyAccount,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        providerUserId: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        provider: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        email: {
            type: "varchar",
            length: 150,
            nullable: true,
        },
        accessToken: {
            type: "text",
            nullable: false,
        },
        refreshToken: {
            type: "text",
            nullable: true,
        },
        expiresAt: {
            type: "datetime",
            nullable: true,
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
        socialIntegrations: {
            type: "one-to-many",
            target: "SocialIntegration",
            inverseSide: "thirdPartyAccount",
        },
    },
    uniques: [
        {
            name: "UQ_user_providerUserId_provider",
            columns: ["user", "providerUserId", "provider"],
        },
    ],
});

export default ThirdPartyAccountSchema;

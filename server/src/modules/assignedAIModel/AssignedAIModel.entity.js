import { EntitySchema } from "typeorm";
import AssignedAIModel from "./AssignedAIModel.model.js";

const AssignedAIModelSchema = new EntitySchema({
    name: "AssignedAIModel",
    tableName: "assigned_ai_models",
    target: AssignedAIModel,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
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
            eager: false,
        },
        aiModel: {
            type: "many-to-one",
            target: "AIModel",
            joinColumn: true,
            nullable: false,
            eager: false,
        },
    },
    uniques: [
        {
            name: "UQ_user_aiModel",
            columns: ["user", "aiModel"],
        },
    ],
});

export default AssignedAIModelSchema;

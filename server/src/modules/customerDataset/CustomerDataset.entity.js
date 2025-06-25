import { EntitySchema } from "typeorm";
import CustomerDataset from "./CustomerDataset.model.js";

const CustomerDatasetSchema = new EntitySchema({
    name: "CustomerDataset",
    tableName: "customer_datasets",
    target: CustomerDataset,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        sourceType: {
            type: "enum",
            enum: ["local", "gdrive", "url", "s3"],
            nullable: false,
        },
        sourcePath: {
            type: "text",
            nullable: false,
        },
        fileType: {
            type: "varchar",
            length: 50,
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
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default CustomerDatasetSchema;

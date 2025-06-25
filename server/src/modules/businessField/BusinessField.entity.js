import { EntitySchema } from "typeorm";
import BusinessField from "./BusinessField.model.js";

const BusinessFieldSchema = new EntitySchema({
    name: "BusinessField",
    tableName: "business_fields",
    target: BusinessField,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true,
        },
    },
});

export default BusinessFieldSchema;

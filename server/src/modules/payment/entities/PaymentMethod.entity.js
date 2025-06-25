import { EntitySchema } from "typeorm";
import PaymentMethod from "../models/PaymentMethod.model.js";

const PaymentMethodSchema = new EntitySchema({
    name: "PaymentMethod",
    tableName: "payment_methods",
    target: PaymentMethod,
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
        payments: {
            type: "one-to-many",
            target: "Payment",
            inverseSide: "method",
        },
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default PaymentMethodSchema;

import { EntitySchema } from "typeorm";
import Payment from "../models/Payment.model.js";

const PaymentSchema = new EntitySchema({
    name: "Payment",
    tableName: "payments",
    target: Payment,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        amount: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        transactionId: {
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
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
        },
        paymentMethod: {
            type: "many-to-one",
            target: "PaymentMethod",
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

export default PaymentSchema;

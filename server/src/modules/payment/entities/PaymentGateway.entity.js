import { EntitySchema } from "typeorm";
import PaymentGateway from "../models/PaymentGateway.model.js";

const PaymentGatewaySchema = new EntitySchema({
    name: "PaymentGateway",
    tableName: "payment_gateways",
    target: PaymentGateway,
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
        },
        apiUrl: {
            type: "text",
            nullable: false,
        },
        callbackUrl: {
            type: "text",
            nullable: false,
        },
        clientId: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        clientSecret: {
            type: "varchar",
            length: 255,
            nullable: false,
            select: false,
        },
        createdAt: {
            type: "datetime",
            nullable: false,
            default: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        status: {
            type: "many-to-one",
            target: "Status",
            joinColumn: true,
            nullable: false,
        },
    },
});

export default PaymentGatewaySchema;

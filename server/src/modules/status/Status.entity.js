import { EntitySchema } from "typeorm";
import Status from "./Status.model.js";

const StatusSchema = new EntitySchema({
    name: "Status",
    tableName: "status",
    target: Status,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        type: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        name: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
    },
    relations: {
        users: { type: "one-to-many", target: "User", inverseSide: "status" },
        aiModels: {
            type: "one-to-many",
            target: "AIModel",
            inverseSide: "status",
            cascade: true,
        },
        paymentGateways: {
            type: "one-to-many",
            target: "PaymentGateway",
            inverseSide: "status",
            cascade: true,
        },
        paymentMethods: {
            type: "one-to-many",
            target: "PaymentMethod",
            inverseSide: "status",
            cascade: true,
        },
        payments: {
            type: "one-to-many",
            target: "Payment",
            inverseSide: "status",
            cascade: true,
        },
        posts: { type: "one-to-many", target: "Post", inverseSide: "status" },
        messages: {
            type: "one-to-many",
            target: "Message",
            inverseSide: "status",
            cascade: true,
        },
        customerDatasets: {
            type: "one-to-many",
            target: "CustomerDataset",
            inverseSide: "status",
            cascade: true,
        },
    },
});

export default StatusSchema;

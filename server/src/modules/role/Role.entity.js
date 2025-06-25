import { EntitySchema } from "typeorm";
import Role from "./Role.model.js";

const RoleSchema = new EntitySchema({
    name: "Role",
    tableName: "roles",
    target: Role,
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
        description: {
            type: "text",
            nullable: true,
        },
    },
    relations: {
        users: {
            type: "one-to-many",
            target: "User",
            inverseSide: "role",
        },
    },
});

export default RoleSchema;

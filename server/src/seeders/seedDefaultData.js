import bcrypt from "bcrypt";

import repositories from "../config/repositoryManager";

const seedDefaultData = async () => {
    // Seed role "admin"
    let adminRole = await repositories.role.findOneBy({ name: "admin" });
    if (!adminRole) {
        adminRole = await repositories.role.save({
            name: "admin",
            description: "Admin",
        });
    }

    // Seed role "user"
    let userRole = await repositories.role.findOneBy({ name: "user" });
    if (!userRole) {
        userRole = await repositories.role.save({
            name: "user",
            description: "User",
        });
    }

    // Danh sách status cần seed
    const statusList = [
        { type: "USER", name: "active" },
        { type: "USER", name: "inactive" },
        { type: "USER", name: "pending" },
        { type: "AI", name: "running" },
        { type: "AI", name: "paused" },
        { type: "MESSAGE", name: "sending" },
        { type: "MESSAGE", name: "sent" },
        { type: "MESSAGE", name: "failed" },
        { type: "PAYMENT", name: "pending" },
        { type: "PAYMENT", name: "success" },
        { type: "PAYMENT", name: "failed" },
        { type: "PAYMENT", name: "canceled" },
        { type: "CHANNEL", name: "active" },
        { type: "CHANNEL", name: "inactive" },
        { type: "CUS_DATASET", name: "uploaded" },
        { type: "CUS_DATASET", name: "processing" },
        { type: "CUS_DATASET", name: "trained" },
        { type: "PAY_GATE", name: "active" },
        { type: "PAY_GATE", name: "inactive" },
        { type: "PAY_METHOD", name: "active" },
        { type: "PAY_METHOD", name: "inactive" },
        { type: "POST", name: "pending" },
        { type: "POST", name: "success" },
    ];

    // Seed toàn bộ status (bulk insert nếu chưa tồn tại)
    const existingStatuses = await repositories.status.find();
    const existingStatusSet = new Set(existingStatuses.map((s) => `${s.type}:${s.name}`));

    const statusesToInsert = statusList.filter(
        (s) => !existingStatusSet.has(`${s.type}:${s.name}`)
    );

    if (statusesToInsert.length > 0) {
        await repositories.status.save(statusesToInsert);
    }

    // Seed status "pending"
    const defaultStatus = await repositories.status.findOne({
        where: { type: "USER", name: "active" },
    });


    // Seed admin user
    const adminEmail = "admin@gmail.com";
    let adminUser = await repositories.user.findOneBy({ email: adminEmail });
    if (!adminUser) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const newUser = repositories.user.create({
            name: "Admin",
            email: adminEmail,
            phone: "0123456789",
            address: "Admin Address",
            password: hashedPassword,
            role: adminRole,
            status: defaultStatus,
        });
        await repositories.user.save(newUser);
    }
};

export default seedDefaultData;

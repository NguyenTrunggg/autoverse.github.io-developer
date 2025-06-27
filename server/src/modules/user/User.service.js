import bcrypt from "bcrypt";

import repositories from "../../config/repositoryManager.js";
import CustomError from "../../utils/CustomError.js";

class UserService {
    // Lấy danh sách tất cả người dùng, kèm role và status
    async getAllUsers({ page, limit }) {
        const skip = (page - 1) * limit;

        const [users, total] = await repositories.user.findAndCount({
            where: { role: { name: "user" } },
            relations: ["role", "status"],
            skip,
            take: limit,
            order: { createdAt: "DESC" }, // optional
        });

        return {
            items: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Lấy người dùng theo ID
    async getUserById(userId) {
        const user = await repositories.user.findOne({
            where: { id: userId },
            relations: ["role", "status"],
        });
        if (!user) {
            throw new CustomError("User not found.", 404);
        }
        return user;
    }

    // Tạo mới người dùng
    async createUser(userInput) {
        const { name, email, phone, address, password, roleId, status } = userInput;
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await repositories.user.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            throw new CustomError("Email is already in use.", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Convert status name to statusId
        const statusEntity = await repositories.status.findOne({ where: { name: status } });
        if (!statusEntity) {
            throw new CustomError(`Status "${status}" not found.`, 400);
        }

        const newUser = repositories.user.create({
            name,
            email: normalizedEmail,
            phone,
            address,
            password: hashedPassword,
            role: { id: roleId },
            status: { id: statusEntity.id },
        });

        await repositories.user.save(newUser);
        return newUser;
    }

    // Cập nhật thông tin người dùng
    async updateUser(userData) {
        const existingUser = await repositories.user.findOne({
            where: { id: userData.userId },
            relations: ["role", "status"],
        });
        console.log(">>> check user : ", existingUser);

        if (!existingUser) {
            throw new CustomError("User not found.", 404);
        }

        const updateData = {};

        if (userData.name) updateData.name = userData.name;
        if (userData.phone) updateData.phone = userData.phone;

        if (userData.email) {
            const normalizedEmail = userData.email.trim().toLowerCase();
            const userWithSameEmail = await repositories.user.findOne({
                where: { email: normalizedEmail },
            });
            if (userWithSameEmail && userWithSameEmail.id !== userData.userId) {
                throw new CustomError("Email is already used by another user.", 400);
            }
            updateData.email = normalizedEmail;
        }

        if (userData.password) {
            updateData.password = await bcrypt.hash(userData.password, 10);
        }

        if (userData.status) {
            const statusEntity = await repositories.status.findOne({
                where: { name: userData.status },
            });
            if (!statusEntity) {
                throw new CustomError(`Status "${userData.status}" not found.`, 400);
            }
            updateData.status = statusEntity;
        }

        Object.assign(existingUser, updateData);

        await repositories.user.save(existingUser);
        return existingUser;
    }

    // Cập nhật trạng thái người dùng
    async updateUserStatus(userId, statusId) {
        const user = await repositories.user.findOne({
            where: { id: userId },
            relations: ["role"],
        });
        if (!user) {
            throw new CustomError("User not found.", 404);
        }

        const status = await repositories.status.findOne({ where: { id: statusId } });
        if (!status) {
            throw new CustomError("Status not found.", 404);
        }

        user.status = status;
        await repositories.user.save(user);
        return user;
    }

    // Xoá người dùng theo ID
    async deleteUser(userId) {
        const user = await repositories.user.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new CustomError("User not found.", 404);
        }

        await repositories.user.softDelete(userId);
        // await repositories.user.remove(user);
        return { message: "User deleted successfully" };
    }
}

export default new UserService();

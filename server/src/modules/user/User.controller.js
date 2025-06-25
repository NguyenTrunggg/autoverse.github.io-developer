import CustomError from "../../utils/CustomError";
import userService from "./User.service";

class UserController {
    // Lấy toàn bộ người dùng
    async getAllUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const data = await userService.getAllUsers({ page, limit });

            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin chi tiết người dùng
    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    // Tạo người dùng mới
    async createUser(req, res, next) {
        try {
            const { name, email, phone, password, status } = req.body;
            if (!name || !email || !phone || !password) {
                throw new CustomError("Missing required fields: name, email, phone, password", 400);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new CustomError("Invalid email format", 400);
            }

            if (password.length < 6) {
                throw new CustomError("Password must be at least 6 characters", 400);
            }

            const newUser = await userService.createUser({
                name,
                email,
                phone,
                address: "", // Default to empty string
                password,
                roleId: 2, // Default to user role
                status: status || "active",
            });

            return res.status(201).json({ success: true, data: newUser });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật người dùng theo ID
    async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const { name, email, phone, password, status } = req.body;

            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new CustomError("Invalid email format", 400);
                }
            }
            
            if (password && password.length < 6) {
                throw new CustomError("Password must be at least 6 characters", 400);
            }

            const updatedUser = await userService.updateUser({
                userId: parseInt(userId),
                name,
                email,
                phone,
                password,
                status,
            });

            return res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req, res, next) {
        try {
            const userId = req.params.id;
            const { statusId } = req.body;
            if (!userId || !statusId) {
                throw new CustomError("Missing required fields", 400);
            }

            const updatedUser = await userService.updateUserStatus(userId, statusId);
            return res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            next(error);
        }
    }

    // Xoá người dùng
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;

            const result = await userService.deleteUser(userId);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();

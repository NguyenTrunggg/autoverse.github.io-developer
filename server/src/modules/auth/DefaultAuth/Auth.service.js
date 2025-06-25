import bcrypt from "bcrypt";
import { IsNull } from "typeorm";

import CustomError from "../../../utils/CustomError";
import JWTAction from "../../../utils/jwt";
import repositories from "../../../config/repositoryManager";

class AuthService {
    // Xử lý logic đăng nhập
    async handleLogin(email, plainPassword) {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await repositories.user.findOne({
            where: {
                email: normalizedEmail,
                loginProvider: IsNull(),
            },
            relations: ["role", "status"],
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                phone: true,
                address: true,
                loginProvider: true,
            },
        });

        if (!user) {
            throw new CustomError("Invalid email or password", 401);
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password);
        if (!isPasswordCorrect) {
            throw new CustomError("Invalid email or password", 401);
        }

        const tokenPayload = {
            id: user.id,
            role: user.role.name,
        };

        // Tạo access token và refresh token
        const accessToken = JWTAction.signAccessToken(tokenPayload);
        const refreshToken = JWTAction.signRefreshToken(tokenPayload);

        const { password, ...safeUser } = user;
        return {
            user: safeUser,
            accessToken,
            refreshToken,
        };
    }

    // Xử lý logic đăng ký
    async handleRegister(userInput) {
        const normalizedEmail = userInput.email.trim().toLowerCase();
        const existingUser = await repositories.user.findOne({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            throw new CustomError("Email already exists", 400);
        }

        // Lấy role mặc định và status mặc định
        const [defaultStatus, defaultRole] = await Promise.all([
            repositories.status.findOne({ where: { type: "USER", name: "active" } }),
            repositories.role.findOne({ where: { name: "user" } }),
        ]);

        if (!defaultStatus || !defaultRole) {
            throw new CustomError("Invalid status or role", 500);
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 10);

        // Tạo đối tượng user mới
        const newUser = repositories.user.create({
            name: userInput.name,
            email: normalizedEmail,
            phone: userInput.phone,
            address: userInput.address,
            password: hashedPassword,
            role: defaultRole,
            status: defaultStatus,
        });

        await repositories.user.save(newUser);
        return newUser;
    }

    // Lấy lại thông tin người dùng sau khi reload trang
    async getMe(data) {
        const user = await repositories.user.findOne({
            where: { id: data.id },
            relations: ["role"],
            select: { id: true, name: true, email: true, role: true },
        });

        return user;
    }
}

export default new AuthService();

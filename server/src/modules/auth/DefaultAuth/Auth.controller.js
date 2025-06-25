import CustomError from "../../../utils/CustomError";
import authService from "./Auth.service";
import JWTAction from "../../../utils/jwt";

class AuthController {
    // Xử lý đăng nhập
    async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const { user, accessToken, refreshToken } = await authService.handleLogin(
                email,
                password
            );

            // Gửi token về client qua cookie
            res.cookie("jwt", accessToken, { httpOnly: true });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ success: true, data: { user, accessToken } });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý đăng ký tài khoản
    async handleRegister(req, res, next) {
        try {
            const { name, email, phone, address, password } = req.body;
            const newUser = await authService.handleRegister({
                name,
                email,
                phone,
                address,
                password,
            });

            return res.status(200).json({ success: true, data: newUser });
        } catch (error) {
            next(error);
        }
    }

    // Xử lý đăng xuất
    async handleLogout(req, res, next) {
        try {
            res.clearCookie("jwt");
            res.clearCookie("refreshToken");

            return res.status(200).json({ success: true, message: "Logout successful" });
        } catch (error) {
            next(error);
        }
    }

    // Làm mới access token bằng refresh token
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new CustomError("No refresh token provided", 403);
            }

            let decoded;
            try {
                decoded = JWTAction.verifyRefreshToken(refreshToken);
            } catch (err) {
                throw new CustomError("Invalid or expired refresh token", 403);
            }

            const newAccessToken = JWTAction.signAccessToken({
                id: decoded.id,
                role: decoded.role,
            });

            res.cookie("jwt", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // HTTPS production only
                maxAge: 15 * 60 * 1000, // 15 phút
            });

            return res.status(200).json({
                success: true,
                data: { accessToken: newAccessToken }, // Optional: có thể bỏ nếu không cần
            });
        } catch (error) {
            next(error);
        }
    }

    // Lấy lại thông tin người dùng sau khi reload trang
    async getMe(req, res, next) {
        try {
            const user = await authService.getMe(req.body);
            // const user = await repositories.user.findOne({
            //     where: { id: req.user.id },
            //     relations: ["role"],
            //     select: { id: true, email: true, role: true },
            // });

            return res.json({ success: true, data: user });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();

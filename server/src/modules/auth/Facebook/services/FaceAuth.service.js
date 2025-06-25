import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt";

import repositories from "../../../../config/repositoryManager";
import CustomError from "../../../../utils/CustomError";
import JWTAction from "../../../../utils/jwt";

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;

class FaceAuthService {
    // ==========================
    // QUY TRÌNH FACEBOOK OAUTH
    // ==========================

    // Xử lý code nhận từ Facebook để lấy token và thông tin user, fanpage
    async processOAuthCode(code, REDIRECT_URI) {
        try {
            const shortLivedToken = await this.getShortLivedToken(code, REDIRECT_URI);
            const longLivedToken = await this.exchangeLongLivedToken(shortLivedToken);
            const fbUser = await this.getFacebookUserInfo(longLivedToken);
            const pages = await this.getManagedPages(longLivedToken);

            return { fbUser, longLivedToken, pages };
        } catch (err) {
            throw new CustomError(`OAuth processing failed: ${err.message}`, 400);
        }
    }

    // Lấy access token ngắn hạn từ code
    async getShortLivedToken(code, REDIRECT_URI) {
        try {
            const res = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
                params: {
                    client_id: FB_APP_ID,
                    client_secret: FB_APP_SECRET,
                    redirect_uri: REDIRECT_URI,
                    code,
                },
            });
            return res.data.access_token;
        } catch (err) {
            throw new CustomError(
                `Failed to get short-lived token: ${
                    err.response?.data?.error?.message || err.message
                }`,
                400
            );
        }
    }

    // Đổi token ngắn hạn thành token dài hạn
    async exchangeLongLivedToken(shortLivedToken) {
        try {
            const res = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
                params: {
                    grant_type: "fb_exchange_token",
                    client_id: FB_APP_ID,
                    client_secret: FB_APP_SECRET,
                    fb_exchange_token: shortLivedToken,
                },
            });
            return res.data.access_token;
        } catch (err) {
            throw new CustomError(
                `Failed to exchange for long-lived token: ${
                    err.response?.data?.error?.message || err.message
                }`,
                400
            );
        }
    }

    // Lấy thông tin user Facebook (id, name, email)
    async getFacebookUserInfo(accessToken) {
        try {
            const res = await axios.get("https://graph.facebook.com/v19.0/me", {
                params: {
                    fields: "id,name,email",
                    access_token: accessToken,
                },
            });
            return res.data;
        } catch (err) {
            throw new CustomError(
                `Failed to get Facebook user info: ${
                    err.response?.data?.error?.message || err.message
                }`,
                400
            );
        }
    }

    // Lấy danh sách fanpage do user quản lý
    async getManagedPages(accessToken) {
        try {
            const res = await axios.get("https://graph.facebook.com/v19.0/me/accounts", {
                params: { access_token: accessToken },
            });

            const pages = res.data.data;
            if (!pages || pages.length === 0) {
                throw new CustomError("No managed fanpages found", 404);
            }

            // Trả về danh sách page gồm id, tên và token riêng
            return pages.map((page) => ({
                id: page.id,
                name: page.name,
                page_access_token: page.access_token,
            }));
        } catch (err) {
            throw new CustomError(
                `Failed to get managed pages: ${err.response?.data?.error?.message || err.message}`,
                400
            );
        }
    }

    // ==========================
    // ĐỒNG BỘ NGƯỜI DÙNG VỚI DB
    // ==========================

    // Đồng bộ hoặc tạo mới user Facebook trong database
    async syncFacebookUser(fbUser) {
        let user = await repositories.user.findOne({
            where: { providerId: fbUser.id, loginProvider: "facebook" },
            relations: ["role"],
        });

        if (!user) {
            user = await this.createFacebookUser(fbUser);
        }

        // Tạo payload token gồm id và role của user
        const payload = { id: user.id, role: user.role.name };
        return {
            user,
            accessToken: JWTAction.signAccessToken(payload),
            refreshToken: JWTAction.signRefreshToken(payload),
        };
    }

    // Tạo mới user Facebook trong DB với mật khẩu ngẫu nhiên
    async createFacebookUser(fbUser) {
        const password = crypto.randomBytes(9).toString("base64").slice(0, 12);
        const hashedPassword = await bcrypt.hash(password, 10);
        const email = fbUser.email || `${fbUser.id}@fbuser.local`;

        // Lấy role "user" hoặc tạo mới nếu chưa có
        const role =
            (await repositories.role.findOneBy({ name: "user" })) ||
            (await repositories.role.save({ name: "user", description: "User" }));

        // Lấy status "active" hoặc tạo mới nếu chưa có
        const status =
            (await repositories.status.findOne({
                where: { type: "USER", name: "active" },
            })) || (await repositories.status.save({ type: "USER", name: "active" }));

        // Tạo user mới với thông tin Facebook
        const newUser = repositories.user.create({
            name: fbUser.name,
            email,
            password: hashedPassword,
            role,
            status,
            providerId: fbUser.id,
            loginProvider: "facebook",
        });

        return await repositories.user.save(newUser);
    }
}

export default new FaceAuthService();

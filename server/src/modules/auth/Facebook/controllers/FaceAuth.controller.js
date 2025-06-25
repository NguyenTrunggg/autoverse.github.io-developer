import faceAuthService from "../services/FaceAuth.service";
import facePostService from "../services/FacePost.service";
import conTemplateService from "../../../contentTemplate/ContentTemplate.service";
import thirdPartyAccountService from "../../../thirdPartyAccount/services/ThirdPartyAccount.service";
import socialIntegrationService from "../../../thirdPartyAccount/services/SocialIntegration.service";
import CustomError from "../../../../utils/CustomError";

const FB_APP_ID = process.env.FB_APP_ID;
const FB_LOGIN_REDIRECT_URI = process.env.FB_LOGIN_REDIRECT_URI;
const FB_CONNECT_REDIRECT_URI = process.env.FB_CONNECT_REDIRECT_URI;

class FaceAuthController {
    // Xử lý đăng nhập
    async redirectToFacebookLogin(req, res, next) {
        try {
            const scopes = [
                "pages_manage_posts",
                "pages_show_list",
                "pages_read_engagement",
                "public_profile",
                "email",
            ];

            const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
                FB_LOGIN_REDIRECT_URI
            )}&scope=${scopes.join(",")}&response_type=code`;

            res.redirect(fbAuthUrl);
        } catch (error) {
            next(error);
        }
    }

    async handleFaceLoginCallback(req, res, next) {
        const { code } = req.query;
        if (!code) throw new CustomError("No code provided", 400);

        try {
            const { fbUser, longLivedToken, pages } = await faceAuthService.processOAuthCode(
                code,
                FB_LOGIN_REDIRECT_URI
            );

            // Lấy thông tin fbUser xử lý đăng nhập hoặc đăng ký
            const { user, accessToken, refreshToken } = await faceAuthService.syncFacebookUser(
                fbUser
            );
            res.cookie("jwt", accessToken, { httpOnly: true });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            const provider = "facebook";
            // Kiểm tra và thêm tài khoản vào table quản lý tài khoản bên thứ 3
            const thirdAccount = await thirdPartyAccountService.autoCreateUpdateThirdAccount({
                mainUserId: user.id,
                provider,
                fbUser,
                longLivedToken,
            });

            // Thêm các fanpage tài khoản bên thứ 3 của người dùng quản lý vào table
            await socialIntegrationService.autoCreateUpdateSocialIntegration({
                thirdAccountId: thirdAccount.id,
                provider,
                pages,
            });
            return res.redirect(process.env.REACT_URL);
        } catch (error) {
            next(error);
        }
    }

    // Backend - redirectToFacebookConnect
    async redirectToFacebookConnect(req, res, next) {
        try {
            const { userId, redirectUrl } = req.query;
            // Gộp userId và redirectUrl vào state
            const state = encodeURIComponent(JSON.stringify({ userId, redirectUrl }));

            const scopes = [
                "pages_manage_posts",
                "pages_show_list",
                "pages_read_engagement",
                "public_profile",
                "email",
            ];

            const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
                FB_CONNECT_REDIRECT_URI
            )}&scope=${scopes.join(",")}&response_type=code&state=${state}`;

            res.redirect(fbAuthUrl);
        } catch (error) {
            next(error);
        }
    }

    // Backend - handleFaceConnectCallback
    async handleFaceConnectCallback(req, res, next) {
        const { code, state } = req.query; // state chính là userId
        if (!code || !state) throw new CustomError("Missing code or state", 400);

        let userId, redirectUrl;
        try {
            const parsedState = JSON.parse(decodeURIComponent(state));
            userId = parsedState.userId;
            redirectUrl = parsedState.redirectUrl || "/";
        } catch (err) {
            return next(new CustomError("Invalid state format", 400));
        }

        try {
            const { fbUser, longLivedToken, pages } = await faceAuthService.processOAuthCode(
                code,
                FB_CONNECT_REDIRECT_URI
            );

            const provider = "facebook";

            const thirdAccount = await thirdPartyAccountService.autoCreateUpdateThirdAccount({
                mainUserId: userId,
                provider,
                fbUser,
                longLivedToken,
            });

            await socialIntegrationService.autoCreateUpdateSocialIntegration({
                thirdAccountId: thirdAccount.id,
                provider,
                pages,
            });

            return res.redirect(`${process.env.REACT_URL}${redirectUrl}`);
        } catch (error) {
            next(error);
        }
    }

    async publishPostToPage(req, res, next) {
        try {
            const { aiContentId, pageId, pageAccessToken } = req.body;

            if (!aiContentId || !pageAccessToken || !pageId)
                throw new CustomError("Missing required fields", 400);

            const aiContent = await conTemplateService.getConTemplateById(aiContentId);
            // Gửi lên fanpage
            const postRes = await facePostService.publishPostToPage({
                pageAccessToken,
                pageId,
                aiContent,
            });

            res.json({ success: true, fbPostId: postRes.id });
        } catch (err) {
            next(err);
        }
    }
}

export default new FaceAuthController();

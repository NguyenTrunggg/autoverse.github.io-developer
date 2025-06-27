import axios from "axios";
import CustomError from "../../../../utils/CustomError.js";

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;

class FaceTokenService {
    async verifyPageAccessToken(pageAccessToken) {
        try {
            const appAccessToken = `${FB_APP_ID}|${FB_APP_SECRET}`;
            const res = await axios.get(`https://graph.facebook.com/debug_token`, {
                params: {
                    input_token: pageAccessToken,
                    access_token: appAccessToken,
                },
            });
            return res.data.data.is_valid === true;
        } catch (err) {
            console.warn("Failed to verify page access token:", err.response?.data || err.message);
            return false;
        }
    }
}

export default new FaceTokenService();

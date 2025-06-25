import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class JWTAction {
    signAccessToken = (payload) => {
        try {
            return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            });
        } catch (error) {
            console.error("Error signing access token:", error);
            return null;
        }
    };

    signRefreshToken = (payload) => {
        try {
            return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_LIFE,
            });
        } catch (error) {
            console.error("Error signing refresh token:", error);
            return null;
        }
    };

    verifyAccessToken = (token) => {
        try {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("Invalid access token:", error);
            return null;
        }
    };

    verifyRefreshToken = (token) => {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            console.error("Invalid refresh token:", error);
            return null;
        }
    };

    extractToken = (req) => {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            return req.headers.authorization.split(" ")[1];
        }
        return null;
    };
}

export default new JWTAction();

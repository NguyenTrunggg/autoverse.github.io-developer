const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import crypto from "crypto";
import bcrypt from "bcrypt";

import JWTAction from "../utils/jwt";
import repositories from "./repositoryManager";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8888/auth/google/callback",
            passReqToCallback: true,
        },
        async function (req, accessToken, refreshToken, profile, cb) {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const providerId = profile.id;
                const loginProvider = profile.provider;

                let [userRole, defaultStatus] = await Promise.all([
                    repositories.role.findOneBy({ name: "user" }),
                    repositories.status.findOne({ where: { type: "USER", name: "active" } }),
                ]);

                if (!userRole) {
                    userRole = await repositories.role.save({
                        name: "user",
                        description: "User",
                    });
                }

                if (!defaultStatus) {
                    defaultStatus = await repositories.status.save({
                        type: "USER",
                        name: "active",
                    });
                }

                // Kiểm tra xem user đã tồn tại chưa
                let user = await repositories.user.findOne({
                    where: { email, loginProvider, providerId },
                });

                const randomPassword = crypto.randomBytes(16).toString("hex");
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                if (!user) {
                    // Nếu chưa có, tạo user mới
                    user = repositories.user.create({
                        name,
                        email,
                        password: hashedPassword,
                        loginProvider,
                        providerId,
                        role: userRole,
                        status: defaultStatus,
                    });
                    await repositories.user.save(user);
                }

                // Tạo JWT
                const payload = {
                    id: user.id,
                    role: user.role,
                };

                const access = JWTAction.signAccessToken(payload);
                const refresh = JWTAction.signRefreshToken(payload);

                // Truyền token vào req để xử lý sau callback
                req.tokens = {
                    accessToken: access,
                    refreshToken: refresh,
                };
                req.user = user;

                return cb(null, user);
            } catch (err) {
                return cb(err, null);
            }
        }
    )
);

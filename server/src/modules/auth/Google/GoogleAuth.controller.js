import CustomError from "../../../utils/CustomError";

class GoogleAuthController {
    async loginCallback(req, res, next) {
        try {
            const { accessToken, refreshToken } = req.tokens;

            res.cookie("jwt", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 5 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.redirect(process.env.REACT_URL);
        } catch (error) {
            next(error);
        }
    }
}

export default new GoogleAuthController();

import JWTService from "../utils/jwt.js";

const checkUserJWT = (req, res, next) => {
    // console.log("Cookies:", req.cookies);
    const tokenFromCookie = req.cookies?.jwt;
    const tokenFromHeader = JWTService.extractToken(req);
    const token = tokenFromCookie || tokenFromHeader;

    if (token) {
        const decoded = JWTService.verifyAccessToken(token);

        if (decoded) {
            req.user = decoded;
            req.token = token;
            return next();
        }
    }

    return res.status(401).json({
        success: false,
        error: "Not authenticated the user",
    });
};

const isAdmin = async (req, res, next) => {
    if (req.user) {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "You don’t have permission to access this resource.",
            });
        }
        return next();
    }
    return res.status(401).json({
        success: false,
        error: "Not authenticated the user",
    });
};

module.exports = {
    checkUserJWT,
    isAdmin,
};

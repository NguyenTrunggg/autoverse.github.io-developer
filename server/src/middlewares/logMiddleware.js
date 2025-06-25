const logMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(
        `Method: ${req.method} - URL: ${req.originalUrl} - Timestamp: [${timestamp}]`
    );
    next();
};

export default logMiddleware;

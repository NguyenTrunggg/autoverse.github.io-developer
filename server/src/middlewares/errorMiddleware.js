const notFoundHandler = (req, res, next) => {
    res.status(404).json({ success: false, error: "Not Found URL" });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
};

export default { notFoundHandler, errorHandler };

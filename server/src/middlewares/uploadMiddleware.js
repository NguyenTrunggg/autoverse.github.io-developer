const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "..", "public", "uploads", "images");

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix);
    },
});

// Bộ lọc file: chỉ cho phép ảnh jpg, jpeg, png
function fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ hỗ trợ file ảnh (jpg, jpeg, png)"), false);
    }
}

// Tạo instance multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
});

module.exports = { upload };

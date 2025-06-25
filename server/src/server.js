import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import configViewEngine from "./config/viewEngine";
import configCors from "./config/cor";
import appRoute from "./routes";
import AppDataSource from "./config/database";
import seedDefaultData from "./seeders/seedDefaultData";
import { initWorkers } from "./workers";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 9999;

// Middleware để parse cookie
app.use(cookieParser());

// Middleware để parse form data (application/x-www-form-urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình view engine (nếu bạn dùng để render HTML server-side)
configViewEngine(app);

// Cấu hình CORS (cho phép frontend gọi từ domain khác)
configCors(app);

// Cho phép truy cập folder images qua URL: /images/*
const imagePath = path.join(__dirname, "public/uploads/images");
app.use("/images", express.static(imagePath));

// Middleware để xử lý JSON và form data với giới hạn dung lượng lớn (50mb)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Connect database
AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected");
        await seedDefaultData();
        initWorkers(); // Khởi động các worker xử lý hàng đợi (Bull queue)
    })
    .catch((err) => {
        console.error("Failed to connect DB:", err);
    });

// Khởi tạo tất cả các routes của ứng dụng
appRoute(app);

// Khởi động server
app.listen(PORT, () => {
    console.log(">> Running port " + PORT);
});

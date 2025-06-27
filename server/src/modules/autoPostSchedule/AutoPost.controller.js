import autoPostService from "./AutoPost.service.js";
import path from "path";
import fs from "fs";

class AutoPostController {
    async create(req, res, next) {
        try {
            const post = await autoPostService.create(req.body);
            res.json({ success: true, data: post });
        } catch (err) {
            next(err);
        }
    }

    async testAI(req, res, next) {
        try {
            const response = await autoPostService.testAI(req.body);
            res.json({ success: true, data: response });
        } catch (err) {
            next(err);
        }
    }

    // Tạo excel
    async createPlanExcel(req, res, next) {
        try {
            const { filePath, fileName } = await autoPostService.createPlanExcel(req.body);

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

            return res.download(filePath, path.basename(filePath), (err) => {
                if (err) {
                    console.error("Download error:", err);
                    next(err);
                } else {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async createScheduleByExcel(req, res, next) {
        try {
            const { businessFieldName, userId, channelId, socialInteId, mediaUrl } = req.body;
            if (!req.file) {
                return res.status(400).json({ success: false, error: "Chưa chọn file Excel" });
            }

            const data = await autoPostService.createScheduleByExcel(req.file.path, {
                businessFieldName,
                userId,
                channelId,
                socialInteId,
                mediaUrl,
            });

            return res.json({ success: true, data: data });
        } catch (error) {
            console.error("Import Excel Error:", error);
            next(error);
        }
    }
}

export default new AutoPostController();

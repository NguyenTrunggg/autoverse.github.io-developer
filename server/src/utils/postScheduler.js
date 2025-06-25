// import fs from "fs";
import "dotenv/config";
import AppDataSource from "../config/database.js";
import facePostService from "../modules/auth/Facebook/services/FacePost.service.js";
import repositories from "../config/repositoryManager.js";

(async () => {
    try {
        await AppDataSource.initialize();

        // Xu ly tim kiem id status pending va success
        const [statusPending, statusSuccess] = await Promise.all([
            (async () => {
                let status = await repositories.status.findOne({
                    where: { type: "POST", name: "pending" },
                });
                if (!status) {
                    status = repositories.status.create({ type: "POST", name: "pending" });
                    await repositories.status.save(status);
                }
                return status;
            })(),
            (async () => {
                let status = await repositories.status.findOne({
                    where: { type: "POST", name: "success" },
                });
                if (!status) {
                    status = repositories.status.create({ type: "POST", name: "success" });
                    await repositories.status.save(status);
                }
                return status;
            })(),
        ]);

        const now = new Date();

        // Giới hạn ±5 phút
        const fiveMinEarlier = new Date(now.getTime() - 5 * 60 * 1000); // -5 phút
        const fiveMinLater = new Date(now.getTime() + 5 * 60 * 1000); // +5 phút

        // Định dạng ngày và giờ
        const pad = (num) => (num < 10 ? "0" + num : num);
        const isoDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const fromTime = fiveMinEarlier.toTimeString().slice(0, 8); // HH:mm:ss
        const toTime = fiveMinLater.toTimeString().slice(0, 8); // HH:mm:ss

        // Lấy các bản ghi đang chờ trong khoảng trên dưới 5p
        const posts = await repositories.post
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.template", "template")
            .leftJoinAndSelect("template.images", "images")
            .leftJoinAndSelect("post.socialIntegration", "socialIntegration")
            .leftJoinAndSelect("post.status", "status")
            .where("post.scheduledDate = :date", { date: isoDate })
            .andWhere("post.scheduledHour BETWEEN :from AND :to", {
                from: fromTime,
                to: toTime,
            })
            .andWhere("status.id = :statusId", { statusId: statusPending.id })
            .getMany();

        // Gọi hàm post các bản ghi lên facebook
        for (const post of posts) {
            try {
                const pageId = post.socialIntegration.integrationId;
                const pageAccessToken = post.socialIntegration.accessToken;
                const aiContent = post.template;

                const fbPostId = await facePostService.publishPostToPage({
                    pageId,
                    pageAccessToken,
                    aiContent,
                });
                console.log(
                    `[${new Date().toISOString()}] ✅ Đăng bài thành công: ${JSON.stringify(
                        fbPostId
                    )}`
                );

                // fs.appendFileSync(
                //     "log.txt",
                //     `[${new Date().toISOString()}] ✅ Post ${
                //         post.id
                //     } đăng thành công: ${JSON.stringify(fbPostId)}\n`
                // );

                post.status = statusSuccess;
                await repositories.post.save(post);
            } catch (err) {
                console.error(
                    `[${new Date().toISOString()}] ❌ Lỗi đăng bài ID ${post.id}: ${err.message}`
                );
            }
        }

        await AppDataSource.destroy();
    } catch (err) {
        console.error("❌ Lỗi hệ thống:", err);
    }
})();

import AppDataSource from "../config/database.js";
import { postCreationQueue } from "../queues";
import repositories from "../config/repositoryManager";
import openai from "../config/openai.js";

postCreationQueue.process(async (job) => {
    try {
        // Đảm bảo DataSource được khởi tạo
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { data, arr } = job.data;
        const { userId, channelId, socialInteId, businessFieldName, mediaUrl } = data;
        const scheduledPosts = arr;
        console.log(">> check arr: ", scheduledPosts);

        // Lấy hoặc tạo status "pending"
        let statusEntity = await repositories.status.findOne({
            where: { type: "POST", name: "pending" },
        });
        if (!statusEntity) {
            statusEntity = await repositories.status.save({ type: "POST", name: "pending" });
        }

        const user = await repositories.user.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("Không tìm thấy user hoặc aiModel");
        }

        for (let i = 0; i < scheduledPosts.length; i++) {
            const post = scheduledPosts[i];

            // Tạo nội dung từ OpenAI
            const prompt = `Tạo bản ghi có các trường: title, body về từ khóa ${post.keyword} trong lĩnh vực ${businessFieldName}. Trả về dưới dạng JSON object với các key: title, body`;

            const contentAi = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });

            const jsonString = contentAi.choices[0].message.content?.trim();

            let data;
            try {
                data = JSON.parse(jsonString);
            } catch (err) {
                const match = jsonString.match(/\{[\s\S]*\}/);
                if (!match) throw new Error("Không parse được JSON từ OpenAI");
                data = JSON.parse(match[0]);
            }

            const contentTemplate = repositories.conTemplate.create({
                title: data.title,
                body: data.body,
                user: { id: user.id },
                aiModel: { id: 1 },
            });
            const savedTemplate = await repositories.conTemplate.save(contentTemplate);

            console.log(">>>>>> Tạo postSchedule:", i + 1);
            // Tạo bài đăng
            const newPost = repositories.post.create({
                scheduledDate: post.date,
                scheduledHour: post.time,
                user: { id: userId },
                template: { id: savedTemplate.id },
                socialIntegration: { id: socialInteId },
                channel: { id: channelId },
                status: { id: statusEntity.id },
            });

            await repositories.post.save(newPost);
        }

        console.log("Worker: hoàn thành tạo các bài đăng.");

        return { message: "Hoàn thành tạo bài đăng", createdCount: scheduledPosts.length };
    } catch (error) {
        console.error("Worker: lỗi xử lý job:", error.message || error);
        throw error;
    }
});

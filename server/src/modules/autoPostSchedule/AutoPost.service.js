import { postCreationQueue } from "../../queues";
import {
    exportPlanToExcel,
    getInforFromExcel,
    removeVietnameseTones,
} from "../../utils/excelUtils";
import openai from "../../config/openai";
import repositories from "../../config/repositoryManager";

class AutoPostService {
    async create(data) {
        // const job = await postCreationQueue.add(data);
        // return job.id;
        return "";
    }

    async testAI(data) {
        const { message } = data;
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Hoặc "gpt-4o-mini", "gpt-3.5-turbo" tùy chọn
            messages: [
                { role: "system", content: "Bạn là một trợ lý AI hữu ích." },
                { role: "user", content: message },
            ],
            temperature: 0.7,
        });

        // console.log(">> check message: ", message);
        // return message;
        return response.choices[0].message.content;
    }

    // Tạo excel
    async createPlanExcel({
        postsPerDay,
        postTimes,
        numberOfDays,
        startDate,
        endDate,
        businessFieldName,
    }) {
        console.log(">> check data: ", {
            postsPerDay,
            postTimes,
            numberOfDays,
            startDate,
            endDate,
            businessFieldName,
        });

        const prompt = `Tạo ${
            numberOfDays * postsPerDay
        } bản ghi JSON gồm: date, time (HH:mm:ss), keyword.
- Trong khoảng từ ${startDate} đến ${endDate}, tổng ${numberOfDays} ngày.
- Mỗi ngày đúng ${postsPerDay} bản ghi, theo các thời điểm: ${postTimes.join(", ")}.
- Keyword liên quan lĩnh vực "${businessFieldName}".
Chỉ trả về mảng JSON gồm các object với key: date, time, keyword. Không thêm mô tả.`;
        console.log(">>> check log: ", prompt);

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", // hoặc gpt-4o-mini nếu cần tối ưu chi phí
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });

            const jsonString = completion.choices[0].message.content?.trim();
            console.log(">> Raw OpenAI response:", jsonString);

            const match = jsonString.match(/\[.*\]/s);
            const cleanJson = match ? match[0] : jsonString;

            const data = JSON.parse(cleanJson);

            const safeBusinessField = removeVietnameseTones(businessFieldName);
            const fileName = `plan_${safeBusinessField}_${startDate}_to_${endDate}.xlsx`;

            const filePath = await exportPlanToExcel(data, fileName);
            return { filePath, fileName };
        } catch (error) {
            console.error("Lỗi khi tạo kế hoạch hoặc parse JSON:", error);
            throw new Error("Không thể tạo hoặc phân tích dữ liệu kế hoạch từ AI");
        }
    }

    // Đẩy công việc tạo bài và tạo lịch vào job queue
    async createScheduleByExcel(filePath, data) {
        const arr = await getInforFromExcel(filePath);
        const job = await postCreationQueue.add({ data: data, arr: arr });
        return job.id;
    }
}

export default new AutoPostService();

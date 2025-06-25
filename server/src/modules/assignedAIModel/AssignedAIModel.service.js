import CustomError from "../../utils/CustomError";
import repositories from "../../config/repositoryManager";

class AssignedAIModelService {
    // Lấy tất cả thông tin giữa user và aimodel
    async getAllAssigned(page, limit) {
        if (page && limit) {
            const skip = (page - 1) * limit;

            const [data, total] = await repositories.assignedAIModel.findAndCount({
                skip,
                take: limit,
                relations: ["user", "aiModel"],
                order: { id: "DESC" },
            });

            return { data, total };
        }

        // Không có phân trang: lấy toàn bộ
        const data = await repositories.assignedAIModel.find({
            relations: ["user", "aiModel"],
            order: { id: "DESC" },
        });

        return { data, total: data.length };
    }

    // lấy thông tin tất cả aimodel theo userId
    async getAssignedByUser(userId) {
        const data = await repositories.assignedAIModel.find({
            where: { user: { id: userId } },
            relations: ["user", "aiModel"],
        });

        if (data.length <= 0) {
            throw new CustomError("AssignedAIModel not found.", 404);
        }
        return data;
    }

    // Gán 1 aimodel mới vào user
    async createAssigned({ userId, aiModelId }) {
        const existing = await repositories.assignedAIModel.findOne({
            where: {
                user: { id: userId },
                aiModel: { id: aiModelId },
            },
        });

        if (existing) {
            throw new CustomError("This AIModel is already assigned to the user", 400);
        }

        const entity = repositories.assignedAIModel.create({
            user: { id: userId },
            aiModel: { id: aiModelId },
        });

        return await repositories.assignedAIModel.save(entity);
    }

    // Sửa thông tin
    async updateAssigned(id, { userId, aiModelId }) {
        const assigned = await repositories.assignedAIModel.findOneBy({ id });
        if (!assigned) throw new CustomError("Assigned model not found", 404);

        const [user, aiModel] = await Promise.all([
            repositories.user.findOneBy({ id: userId }),
            repositories.aiModel.findOneBy({ id: aiModelId }),
        ]);

        if (!user) throw new CustomError("User not found", 404);
        if (!aiModel) throw new CustomError("AI Model not found", 404);

        assigned.user = user;
        assigned.aiModel = aiModel;

        return await repositories.assignedAIModel.save(assigned);
    }

    // Xóa liên kết giữa aimodel và user
    async deleteAssigned(id) {
        const assigned = await repositories.assignedAIModel.findOneBy({ id });
        if (!assigned) throw new CustomError("Assigned model not found", 404);

        await repositories.assignedAIModel.remove(assigned);
        return { message: "Deleted successfully" };
    }
}

export default new AssignedAIModelService();

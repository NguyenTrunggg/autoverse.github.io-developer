import CustomError from "../../utils/CustomError.js";
import repositories from "../../config/repositoryManager.js";

class AIModelService {
    // Lấy danh sách tất cả mô hình AI
    async getAllAIModels() {
        const aiModels = await repositories.aiModel
            .createQueryBuilder("AIModel")
            .leftJoinAndSelect("AIModel.status", "status")
            .getMany();
        return aiModels;
    }

    // Lấy thông tin mô hình AI theo Id
    async getAIModelById(aiModelId) {
        const aiModel = await repositories.aiModel.findOne({
            where: { id: aiModelId },
            relations: ["status"],
        });
        if (!aiModel) {
            throw new CustomError("AiModel not found.", 404);
        }
        return aiModel;
    }

    // Tạo mới AI model
    async createAIModel(aiModelData) {
        const existingAIModel = await repositories.aiModel.findOne({
            where: { name: aiModelData.name, apiKey: aiModelData.apiKey },
        });

        if (existingAIModel) {
            throw new CustomError("AIModel is already in use.", 400);
        }

        const status = await repositories.status.findOne({
            where: { id: aiModelData.statusId },
        });
        if (!status) throw new CustomError("Status not found", 404);

        const newAIModel = repositories.aiModel.create({
            name: aiModelData.name,
            apiKey: aiModelData.apiKey,
            status,
        });

        await repositories.aiModel.save(newAIModel);
        return newAIModel;
    }

    // Cập nhật thông tin mô hình AI
    async updateAIModel(aiModelId, aiModelData) {
        const aiModel = await repositories.aiModel.findOne({
            where: { id: aiModelId },
        });
        if (!aiModel) {
            throw new CustomError("AIModel doesn't exist.", 404);
        }

        const status = await repositories.status.findOne({
            where: { id: aiModelData.statusId },
        });
        if (!status) throw new CustomError("Status not found", 404);

        aiModel.name = aiModelData.name;
        aiModel.apiKey = aiModelData.apiKey;
        aiModel.status = status;

        await repositories.aiModel.save(aiModel);
        return aiModel;
    }

    // Cập nhật trạng thái mô hình AI
    async updateAIModelStatus(aiModelId, statusId) {
        const aiModel = await repositories.aiModel.findOne({
            where: { id: aiModelId },
            relations: ["status"],
        });

        if (!aiModel) {
            throw new CustomError("AIModel doesn't exist.", 404);
        }

        const status = await repositories.status.findOne({ where: { id: statusId } });
        if (!status) {
            throw new CustomError("Status not found.", 404);
        }

        aiModel.status = status;

        await repositories.aiModel.save(aiModel);
        return aiModel;
    }

    // Xoá aiModel theo ID
    async deleteAIModel(aiModelId) {
        const aiModel = await repositories.aiModel.findOne({
            where: { id: aiModelId },
        });

        if (!aiModel) {
            throw new CustomError("AIModel not found.", 404);
        }

        const [
            assignedCount,
            chatInteractionCount,
            contentTemplateCount,
            customDatasetCount,
            promotionCount,
        ] = await Promise.all([
            repositories.assignedAIModel.countBy({ aiModel: { id: aiModelId } }),
            repositories.chatInterac.countBy({ aiModel: { id: aiModelId } }),
            repositories.conTemplate.countBy({ aiModel: { id: aiModelId } }),
            repositories.cusDataset.countBy({ aiModel: { id: aiModelId } }),
            repositories.userPromotion.countBy({ aiModel: { id: aiModelId } }),
        ]);

        const isUsed =
            assignedCount > 0 ||
            chatInteractionCount > 0 ||
            contentTemplateCount > 0 ||
            customDatasetCount > 0 ||
            promotionCount > 0;

        if (isUsed) {
            throw new CustomError("Cannot delete an AI model that is currently in use.", 400);
        }

        await repositories.aiModel.remove(aiModel);
        return { message: "AIModel deleted successfully" };
    }
}

export default new AIModelService();

import aiModelService from "./AIModel.service";

class AIModelController {
    // Lấy toàn bộ mô hình AI
    async getAllAIModels(req, res, next) {
        try {
            const aiModels = await aiModelService.getAllAIModels();
            return res.status(200).json({ success: true, data: aiModels });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin mô hình AI theo Id
    async getAIModelById(req, res, next) {
        try {
            const aiModelId = req.params.id;
            const aiModel = await aiModelService.getAIModelById(aiModelId);
            return res.status(200).json({ success: true, data: aiModel });
        } catch (error) {
            next(error);
        }
    }

    // Tạo mới mô hình AI
    async createAIModel(req, res, next) {
        try {
            const { name, apiKey, statusId } = req.body;
            const newAIModel = await aiModelService.createAIModel({
                name,
                apiKey,
                statusId,
            });

            return res.status(201).json({ success: true, data: newAIModel });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật mô hình AI theo ID
    async updateAIModel(req, res, next) {
        try {
            const aiModelId = req.params.id;
            const { name, apiKey, statusId } = req.body;

            const updatedAIModel = await aiModelService.updateAIModel(aiModelId, {
                name,
                apiKey,
                statusId,
            });

            return res.status(200).json({ success: true, data: updatedAIModel });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật  trạng thái mô hình AI theo ID
    async updateAIModelStatus(req, res, next) {
        try {
            const aiModelId = req.params.id;
            const { statusId } = req.body;

            const updatedAIModel = await aiModelService.updateAIModelStatus(
                aiModelId,
                parseInt(statusId)
            );

            return res.status(200).json({ success: true, data: updatedAIModel });
        } catch (error) {
            next(error);
        }
    }

    // Xoá mô hình AI
    async deleteAIModel(req, res, next) {
        try {
            const aiModelId = req.params.id;

            const result = await aiModelService.deleteAIModel(aiModelId);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new AIModelController();

import CustomError from "../../utils/CustomError";
import contentTemplateService from "./ContentTemplate.service";

class ContentTemplateController {
    // Lấy toàn bộ nội dung mẫu
    async getAllConTemplates(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const conTemplates = await contentTemplateService.getAllConTemplates(page, limit);

            return res.status(200).json({ success: true, data: conTemplates });
        } catch (error) {
            next(error);
        }
    }

    // Lấy nội dung mẫu theo Id
    async getConTemplateById(req, res, next) {
        try {
            const conTemplateId = req.params.id;
            const conTemplate = await contentTemplateService.getConTemplateById(conTemplateId);
            return res.status(200).json({ success: true, data: conTemplate });
        } catch (error) {
            next(error);
        }
    }

    // Tạo mới nội dung mẫu
    async createConTemplate(req, res, next) {
        try {
            const { title, body, userId, aiModelId } = req.body;
            const newConTemplate = await contentTemplateService.createConTemplate({
                title,
                body,
                userId,
                aiModelId,
            });

            return res.status(201).json({ success: true, data: newConTemplate });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật nội dung mẫu theo ID
    async updateConTemplate(req, res, next) {
        try {
            const conTemplateId = req.params.id;
            const { title, body, userId, aiModelId } = req.body;

            const imageUrls =
                req.files?.map((file) => {
                    return `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;
                }) || [];

            const dataToUpdate = {
                conTemplateId,
                imageUrls,
            };

            if (title) dataToUpdate.title = title;
            if (body) dataToUpdate.body = body;
            if (userId) dataToUpdate.userId = userId;
            if (aiModelId) dataToUpdate.aiModelId = aiModelId;

            const updated = await contentTemplateService.updateConTemplate(dataToUpdate);

            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    // Xoá nội dung mẫu
    async deleteConTemplate(req, res, next) {
        try {
            const conTemplateId = req.params.id;

            const result = await contentTemplateService.deleteConTemplate(conTemplateId);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new ContentTemplateController();

import assignedAIModelService from "./AssignedAIModel.service";
import CustomError from "../../utils/CustomError";

class AssignedAIModelController {
    // Lấy tất cả thông tin giữa user và aimodel
    async getAllAssigned(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page) : null;
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const { data, total } = await assignedAIModelService.getAllAssigned(page, limit);

            const response = {
                success: true,
                data,
            };

            if (page && limit) {
                response.pagination = {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    // lấy thông tin tất cả aimodel theo userId
    async getAssignedByUser(req, res, next) {
        try {
            const userId = req.params.id;
            const data = await assignedAIModelService.getAssignedByUser(userId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // Gán 1 aimodel mới vào user
    async createAssigned(req, res, next) {
        try {
            const { userId, aiModelId } = req.body;

            const newData = await assignedAIModelService.createAssigned({ userId, aiModelId });
            res.status(201).json({ success: true, data: newData });
        } catch (err) {
            next(err);
        }
    }

    // Sửa thông tin
    async updateAssigned(req, res, next) {
        try {
            const { id } = req.params;
            const { userId, aiModelId } = req.body;

            const updated = await assignedAIModelService.updateAssigned(id, { userId, aiModelId });
            res.status(200).json({ success: true, data: updated });
        } catch (err) {
            next(err);
        }
    }

    // Xóa liên kết giữa aimodel và user
    async deleteAssigned(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) throw new CustomError("Missing ID", 400);

            const result = await assignedAIModelService.deleteAssigned(id);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

export default new AssignedAIModelController();

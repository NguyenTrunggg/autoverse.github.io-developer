import promotionUsageService from "../services/PromotionUsage.service.js";
import CustomError from "../../../utils/CustomError.js";

class PromotionUsageController {
    // Lấy danh sách
    async getAllPromotionUsages(req, res, next) {
        try {
            const data = await promotionUsageService.getAllPromotionUsages();
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // Lấy thông tin
    async getPromotionUsageById(req, res, next) {
        try {
            const proUsageId = req.params.id;
            const data = await promotionUsageService.getPromotionUsageById(proUsageId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // Tạo bản ghi
    async createPromotionUsage(req, res, next) {
        try {
            const { userId, promotionId, serviceType, usageDate, count } = req.body;
            const usage = await promotionUsageService.createPromotionUsage({
                userId,
                promotionId,
                serviceType,
                usageDate,
                count,
            });
            res.status(201).json({ success: true, data: usage });
        } catch (err) {
            next(err);
        }
    }

    // Sửa bản ghi
    async updatePromotionUsage(req, res, next) {
        try {
            const { id } = req.params;
            const { userId, promotionId, serviceType, usageDate, count } = req.body;
            const updated = await promotionUsageService.updatePromotionUsage(id, {
                userId,
                promotionId,
                serviceType,
                usageDate,
                count,
            });
            res.status(200).json({ success: true, data: updated });
        } catch (err) {
            next(err);
        }
    }

    // Xóa bản ghi
    async deletePromotionUsage(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) throw new CustomError("Missing ID parameter", 400);
            const result = await promotionUsageService.deletePromotionUsage(id);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

export default new PromotionUsageController();

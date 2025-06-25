import userPromotionService from "../services/UserPromotion.service";
import CustomError from "../../../utils/CustomError";

class UserPromotionController {
    // Lấy Danh sách
    async getAllUserPromotions(req, res, next) {
        try {
            const data = await userPromotionService.getAllUserPromotions();
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // Lấy thông tin chi tiết
    async getUserPromotionById(req, res, next) {
        try {
            const userProId = req.params.id;
            const data = await userPromotionService.getUserPromotionById(userProId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }

    // Tạo mới bản ghi
    async createUserPromotion(req, res, next) {
        try {
            const { userId, startDate, endDate, aiModelId, note } = req.body;
            const newPromo = await userPromotionService.createUserPromotion({
                userId,
                startDate,
                endDate,
                aiModelId,
                note,
            });
            res.status(201).json({ success: true, data: newPromo });
        } catch (err) {
            next(err);
        }
    }

    // Sửa thông tin
    async updateUserPromotion(req, res, next) {
        try {
            const { id } = req.params;
            const { userId, startDate, endDate, aiModelId, note } = req.body;
            const updated = await userPromotionService.updateUserPromotion(id, {
                userId,
                startDate,
                endDate,
                aiModelId,
                note,
            });

            res.status(200).json({ success: true, data: updated });
        } catch (err) {
            next(err);
        }
    }

    // Xóa bản ghi
    async deleteUserPromotion(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userPromotionService.deleteUserPromotion(id);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserPromotionController();

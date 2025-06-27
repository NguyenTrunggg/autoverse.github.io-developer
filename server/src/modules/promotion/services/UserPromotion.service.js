import repositories from "../../../config/repositoryManager.js";
import CustomError from "../../../utils/CustomError.js";

class UserPromotionService {
    // Láy danh sách
    async getAllUserPromotions() {
        return await repositories.userPromotion.find({
            relations: ["user", "aiModel"],
        });
    }

    // Lấy thông tin chi tiết
    async getUserPromotionById(userProId) {
        const userPromotion = await repositories.userPromotion.findOne({
            where: { id: userProId },
            relations: ["user", "aiModel"],
        });
        if (!userPromotion) {
            throw new CustomError(`User Promotion with ID ${userProId} not found`, 404);
        }
        return userPromotion;
    }

    // Tạo mới bản ghi
    async createUserPromotion(data) {
        const { userId, startDate, endDate, aiModelId, note } = data;
        const newPromo = repositories.userPromotion.create({
            user: { id: userId },
            startDate,
            endDate,
            aiModel: { id: aiModelId },
            note,
        });
        return await repositories.userPromotion.save(newPromo);
    }

    // Sửa thông tin
    async updateUserPromotion(id, data) {
        const { userId, startDate, endDate, aiModelId, note } = data;

        const promo = await repositories.userPromotion.findOneBy({ id });
        if (!promo) throw new CustomError("User promotion not found", 404);

        const [user, aiModel] = await Promise.all([
            repositories.user.findOneBy({ id: userId }),
            repositories.aiModel.findOneBy({ id: aiModelId }),
        ]);

        if (!user) throw new CustomError("User not found", 404);
        if (!aiModel) throw new CustomError("AI model not found", 404);

        promo.user = user;
        promo.aiModel = aiModel;
        promo.startDate = startDate;
        promo.endDate = endDate;
        promo.note = note;

        return await repositories.userPromotion.save(promo);
    }

    // Xóa bản ghi
    async deleteUserPromotion(id) {
        const promo = await repositories.userPromotion.findOneBy({ id });
        if (!promo) throw new CustomError("User promotion not found", 404);

        const isUsedInProUsages =
            (await repositories.promotionUsage.countBy({ promotion: { id: id } })) > 0;

        if (isUsedInProUsages) {
            throw new CustomError("Cannot delete a User Promotion that is currently in use.", 400);
        }
        await repositories.userPromotion.remove(promo);
        return { message: "Deleted successfully" };
    }
}

export default new UserPromotionService();

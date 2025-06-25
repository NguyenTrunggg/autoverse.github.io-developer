import repositories from "../../../config/repositoryManager";
import CustomError from "../../../utils/CustomError";

class PromotionUsageService {
    async getAllPromotionUsages() {
        return await repositories.promotionUsage.find({
            relations: ["user", "promotion"],
        });
    }

    async getPromotionUsageById(proUsageId) {
        const promotionUsage = await repositories.promotionUsage.findOne({
            where: { id: proUsageId },
            relations: ["user", "promotion"],
        });
        if (!promotionUsage) {
            throw new CustomError(`Promotion Usage with ID ${proUsageId} not found`, 404);
        }
        return promotionUsage;
    }

    async createPromotionUsage(data) {
        const { userId, promotionId, serviceType, usageDate, count } = data;

        const newUsage = repositories.promotionUsage.create({
            user: { id: userId },
            promotion: { id: promotionId },
            serviceType,
            usageDate,
            count,
        });

        return await repositories.promotionUsage.save(newUsage);
    }

    async updatePromotionUsage(id, data) {
        const usage = await repositories.promotionUsage.findOneBy({ id });
        if (!usage) throw new CustomError("Promotion usage not found", 404);

        const { userId, promotionId, serviceType, usageDate, count } = data;

        const [foundUser, foundPromotion] = await Promise.all([
            repositories.user.findOneBy({ id: userId }),
            repositories.userPromotion.findOneBy({ id: promotionId }),
        ]);

        if (!foundUser) throw new CustomError("User not found", 404);
        if (!foundPromotion) throw new CustomError("Promotion not found", 404);

        usage.user = foundUser;
        usage.promotion = foundPromotion;
        usage.serviceType = serviceType;
        usage.usageDate = usageDate;
        usage.count = count;

        return await repositories.promotionUsage.save(usage);
    }

    async deletePromotionUsage(id) {
        const usage = await repositories.promotionUsage.findOneBy({ id });
        if (!usage) throw new CustomError("Promotion usage not found", 404);

        await repositories.promotionUsage.remove(usage);
        return { message: "Deleted successfully" };
    }
}

export default new PromotionUsageService();

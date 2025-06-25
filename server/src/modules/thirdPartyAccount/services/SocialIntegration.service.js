import repositories from "../../../config/repositoryManager";
import CustomError from "../../../utils/CustomError";

class SocialIntegrationService {
    async autoCreateUpdateSocialIntegration(data) {
        const { thirdAccountId, provider, pages } = data;

        const results = [];

        for (const page of pages) {
            const {
                id: integrationId,
                name: integrationName,
                page_access_token: accessToken,
            } = page;

            // Kiểm tra xem integration đã tồn tại chưa
            const existing = await repositories.socialIntegration.findOne({
                where: {
                    thirdPartyAccountId: thirdAccountId,
                    integrationId,
                },
            });

            if (existing) {
                // Cập nhật nếu đã tồn tại
                existing.integrationName = integrationName;
                existing.accessToken = accessToken;
                existing.updatedAt = new Date();

                const updated = await repositories.socialIntegration.save(existing);
                results.push(updated);
            } else {
                // Tạo mới nếu chưa tồn tại
                const newIntegration = repositories.socialIntegration.create({
                    thirdPartyAccountId: thirdAccountId,
                    provider,
                    integrationId,
                    integrationName,
                    accessToken,
                });

                const saved = await repositories.socialIntegration.save(newIntegration);
                results.push(saved);
            }
        }

        return results;
    }

    async getInforById(id) {
        if (!id) {
            throw new CustomError("Missing required fields", 400);
        }
        return await repositories.socialIntegration.findOne({
            where: { id },
            relations: ["thirdPartyAccount"],
        });
    }

    async getInforByThirdAccId(thirdAccId) {
        if (!thirdAccId) {
            throw new CustomError("Missing required fields", 400);
        }
        return await repositories.socialIntegration.find({
            where: { thirdPartyAccountId: thirdAccId },
            relations: ["thirdPartyAccount"],
        });
    }

    async getAllSocialIntegrations() {
        return await repositories.socialIntegration.find({
            relations: ["thirdPartyAccount"],
        });
    }
}

export default new SocialIntegrationService();

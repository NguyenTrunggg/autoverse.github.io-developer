import repositories from "../../../config/repositoryManager";
import CustomError from "../../../utils/CustomError";

class ThirdPartyAccountService {
    async autoCreateUpdateThirdAccount(data) {
        const { mainUserId, fbUser, longLivedToken, provider } = data;

        const existingAccount = await repositories.thirdAccount.findOne({
            where: {
                user: { id: mainUserId },
                providerUserId: fbUser.id,
                provider: provider,
            },
        });

        if (existingAccount) {
            existingAccount.accessToken = longLivedToken;
            return await repositories.thirdAccount.save(existingAccount);
        }

        const newThirdAcc = repositories.thirdAccount.create({
            name: fbUser.name,
            email: fbUser.email,
            providerUserId: fbUser.id,
            accessToken: longLivedToken,
            user: { id: mainUserId },
            provider,
        });

        return await repositories.thirdAccount.save(newThirdAcc);
    }

    async getInforById(id) {
        if (!id) {
            throw new CustomError("Missing required fields", 400);
        }
        return await repositories.thirdAccount.findOneBy({ id });
    }

    async getInforByUser(id) {
        if (!id) {
            throw new CustomError("Missing required fields", 400);
        }
        return await repositories.thirdAccount.find({
            where: {
                user: { id: id },
            },
        });
    }

    async getAllAccounts() {
        return await repositories.thirdAccount.find();
    }
}

export default new ThirdPartyAccountService();

import CustomError from "../../../utils/CustomError";
import thirdPartyAccountService from "../services/ThirdPartyAccount.service";

class ThirdPartyAccountController {
    async getInforById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new CustomError("Missing required fields", 400);
            }
            const thirdAcc = await thirdPartyAccountService.getInforById(id);
            return res.status(201).json({ success: true, data: thirdAcc });
        } catch (error) {
            next(error);
        }
    }

    async getInforByUser(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new CustomError("Missing required fields", 400);
            }
            const thirdAcc = await thirdPartyAccountService.getInforByUser(id);
            return res.status(201).json({ success: true, data: thirdAcc });
        } catch (error) {
            next(error);
        }
    }

    async getAllAccounts(req, res, next) {
        try {
            const thirdAccs = await thirdPartyAccountService.getAllAccounts();

            return res.status(201).json({ success: true, data: thirdAccs });
        } catch (error) {
            next(error);
        }
    }
}

export default new ThirdPartyAccountController();

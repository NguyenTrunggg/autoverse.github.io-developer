import CustomError from "../../../utils/CustomError.js";
import socialInteService from "../services/SocialIntegration.service.js";

class SocialInteController {
    async getInforByThirdAccId(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new CustomError("Missing required fields", 400);
            }
            const socialList = await socialInteService.getInforByThirdAccId(id);
            return res.status(201).json({ success: true, data: socialList });
        } catch (error) {
            next(error);
        }
    }
}

export default new SocialInteController();

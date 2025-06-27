import CustomError from "../../utils/CustomError.js";
import businessFieldService from "./BusinessField.service.js";

class BusinessFieldController {
    // Lấy tất cả lĩnh vực kinh doanh
    async getAllBusinessFields(req, res, next) {
        try {
            const businessFields = await businessFieldService.getAllBusinessFields();
            return res.status(200).json({ success: true, data: businessFields });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin lĩnh vực kinh doanh theo Id
    async getBusinessFieldById(req, res, next) {
        try {
            const busFieldId = req.params.id;
            const businessFields = await businessFieldService.getBusinessFieldById(busFieldId);
            return res.status(200).json({ success: true, data: businessFields });
        } catch (error) {
            next(error);
        }
    }

    // Tạo lĩnh vực kinh doanh mới
    async createBusinessField(req, res, next) {
        try {
            const { name } = req.body;
            const newBusinessField = await businessFieldService.createBusinessField(name);
            return res.status(201).json({ success: true, data: newBusinessField });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật lĩnh vực kinh doanh theo ID
    async updateBusinessField(req, res, next) {
        try {
            const businessFieldId = req.params.id;
            const { name } = req.body;

            const updatedBusinessField = await businessFieldService.updateBusinessField(
                businessFieldId,
                name
            );
            return res.status(200).json({ success: true, data: updatedBusinessField });
        } catch (error) {
            next(error);
        }
    }

    // Xoá lĩnh vực kinh doanh theo ID
    async deleteBusinessField(req, res, next) {
        try {
            const businessFieldId = req.params.id;

            if (!businessFieldId) {
                throw new CustomError("Business field ID is required", 400);
            }

            const deletedBusinessField = await businessFieldService.deleteBusinessField(
                businessFieldId
            );
            return res.status(200).json({ success: true, data: deletedBusinessField });
        } catch (error) {
            next(error);
        }
    }
}

export default new BusinessFieldController();

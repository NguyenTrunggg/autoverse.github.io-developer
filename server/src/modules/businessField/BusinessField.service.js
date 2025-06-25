import repositories from "../../config/repositoryManager";
import CustomError from "../../utils/CustomError";

class BusinessFieldService {
    // Lấy tất cả lĩnh vực kinh doanh
    async getAllBusinessFields() {
        const businessFields = await repositories.businessField.find();
        return businessFields;
    }

    // Lấy thông tin lĩnh vực kinh doanh theo Id
    async getBusinessFieldById(businessFieldId) {
        const businessField = await repositories.businessField.findOne({
            where: { id: businessFieldId },
        });
        if (!businessField) {
            throw new CustomError("Business_Field not found.", 404);
        }
        return businessField;
    }

    // Tạo lĩnh vực kinh doanh mới
    async createBusinessField(businessFieldName) {
        const newBusinessField = repositories.businessField.create({ name: businessFieldName });
        const savedBusinessField = await repositories.businessField.save(newBusinessField);
        return savedBusinessField;
    }

    // Cập nhật lĩnh vực kinh doanh theo ID
    async updateBusinessField(businessFieldId, newName) {
        const existingBusinessField = await repositories.businessField.findOne({
            where: { id: businessFieldId },
        });

        if (!existingBusinessField) {
            throw new CustomError("Business Field not found.", 404);
        }

        existingBusinessField.name = newName;
        const updatedBusinessField = await repositories.businessField.save(existingBusinessField);
        return updatedBusinessField;
    }

    // Xoá lĩnh vực kinh doanh theo ID
    async deleteBusinessField(businessFieldId) {
        const existingBusinessField = await repositories.businessField.findOne({
            where: { id: businessFieldId },
        });

        if (!existingBusinessField) {
            throw new CustomError("Business Field not found.", 404);
        }

        await repositories.businessField.remove(existingBusinessField);
        return { message: "Business Field deleted successfully." };
    }
}

export default new BusinessFieldService();

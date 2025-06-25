import CustomError from "../../utils/CustomError";
import repositories from "../../config/repositoryManager";

class CustomerDatasetService {
    // Lấy tất cả dữ liệu training AI cá nhân
    async getAllCustomerDatasets() {
        const customerDatasets = await repositories.cusDataset.find({
            relations: ["user", "aiModel", "status"],
        });
        return customerDatasets;
    }

    // Lấy thông tin dữ liệu training AI cá nhân theo ID
    async getCustomerDatasetById(cusDatasetId) {
        const customerDataset = await repositories.cusDataset.findOne({
            where: { id: cusDatasetId },
            relations: ["aiModel", "status", "user"],
        });
        if (!customerDataset) {
            throw new CustomError("Customer Dataset not found.", 404);
        }
        return customerDataset;
    }

    // Tạo mới dữ liệu training AI cá nhân
    async createCustomerDataset(cusDatasetInput) {
        const { name, sourceType, sourcePath, fileType, userId, aiModelId } = cusDatasetInput;

        // Kiểm tra sự tồn tại của user, AI model và status
        const [user, aiModel, status] = await Promise.all([
            repositories.user.findOne({ where: { id: userId } }),
            repositories.aiModel.findOne({ where: { id: aiModelId } }),
            repositories.status.findOne({ where: { type: "CUS_DATASET", name: "uploaded" } }),
        ]);

        if (!user) {
            throw new CustomError("User not found.", 404);
        }
        if (!aiModel) {
            throw new CustomError("AI Model not found.", 404);
        }
        if (!status) {
            status = await repositories.status.save({ type: "CUS_DATASET", name: "uploaded" });
        }

        const newCusDataset = repositories.cusDataset.create({
            name,
            sourceType,
            sourcePath,
            fileType,
            user: user,
            aiModel: aiModel,
            status: status,
        });

        await repositories.cusDataset.save(newCusDataset);
        return newCusDataset;
    }

    // Cập nhật dữ liệu training AI cá nhân
    async updateCustomerDataset(cusDatasetInput) {
        const {
            cusDatasetId,
            name,
            sourceType,
            sourcePath,
            fileType,
            userId,
            aiModelId,
            statusId,
        } = cusDatasetInput;

        const existingDataset = await repositories.cusDataset.findOne({
            where: { id: cusDatasetId },
            relations: ["user", "aiModel", "status"],
        });

        if (!existingDataset) {
            throw new CustomError("Customer dataset not found.", 404);
        }

        const [user, aiModel, status] = await Promise.all([
            repositories.user.findOne({ where: { id: userId } }),
            repositories.aiModel.findOne({ where: { id: aiModelId } }),
            repositories.status.findOne({ where: { id: statusId } }),
        ]);

        if (!user) {
            throw new CustomError("User not found.", 404);
        }
        if (!aiModel) {
            throw new CustomError("AI Model not found.", 404);
        }
        if (!status) {
            throw new CustomError("Status not found.", 404);
        }

        // Cập nhật các trường còn lại nếu được cung cấp
        existingDataset.name = name;
        existingDataset.sourceType = sourceType;
        existingDataset.sourcePath = sourcePath;
        existingDataset.fileType = fileType;
        existingDataset.user = user;
        existingDataset.aiModel = aiModel;
        existingDataset.status = status;

        await repositories.cusDataset.save(existingDataset);
        return existingDataset;
    }

    // Update the status of a Customer Dataset
    async updateCustomerDatasetStatus({ cusDatasetId, statusId }) {
        const dataset = await repositories.cusDataset.findOne({
            where: { id: cusDatasetId },
            relations: ["status"],
        });

        if (!dataset) {
            throw new CustomError("Customer dataset not found.", 404);
        }

        const status = await repositories.status.findOne({ where: { id: statusId } });
        if (!status) {
            throw new CustomError("Status not found.", 404);
        }

        dataset.status = status;
        await repositories.cusDataset.save(dataset);
        return dataset;
    }

    // Xoá dữ liệu training AI cá nhân theo ID
    async deleteCustomerDataset(cusDatasetId) {
        const customerDataset = await repositories.cusDataset.findOne({
            where: { id: cusDatasetId },
        });

        if (!customerDataset) {
            throw new CustomError("Customer Dataset not found.", 404);
        }

        await repositories.cusDataset.remove(customerDataset);
        return { message: "Customer Dataset deleted successfully" };
    }
}

export default new CustomerDatasetService();

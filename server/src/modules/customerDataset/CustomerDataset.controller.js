import customerDatasetService from "./CustomerDataset.service.js";
import CustomError from "../../utils/CustomError.js";

class CustomerDatasetController {
    // Lấy toàn dữ liệu training AI cá nhân
    async getAllCustomerDatasets(req, res, next) {
        try {
            const customerDatasets = await customerDatasetService.getAllCustomerDatasets();
            return res.status(200).json({ success: true, data: customerDatasets });
        } catch (error) {
            next(error);
        }
    }

    // Lấy dữ liệu training AI cá nhân chi tiết
    async getCustomerDatasetById(req, res, next) {
        try {
            const cusDatasetId = req.params.id;
            const customerDataset = await customerDatasetService.getCustomerDatasetById(
                cusDatasetId
            );
            return res.status(200).json({ success: true, data: customerDataset });
        } catch (error) {
            next(error);
        }
    }

    // Tạo mới dữ liệu training AI cá nhân
    async createCustomerDataset(req, res, next) {
        try {
            const { name, sourceType, sourcePath, fileType, userId, aiModelId } = req.body;
            const newCustomerDataset = await customerDatasetService.createCustomerDataset({
                name,
                sourceType,
                sourcePath,
                fileType,
                userId,
                aiModelId,
            });

            return res.status(201).json({ success: true, data: newCustomerDataset });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật dữ liệu training AI cá nhân theo ID
    async updateCustomerDataset(req, res, next) {
        try {
            const cusDatasetId = req.params.id;
            const { name, sourceType, sourcePath, fileType, userId, aiModelId, statusId } =
                req.body;

            const updatedCusDataset = await customerDatasetService.updateCustomerDataset({
                cusDatasetId,
                name,
                sourceType,
                sourcePath,
                fileType,
                userId,
                aiModelId,
                statusId,
            });

            return res.status(200).json({ success: true, data: updatedCusDataset });
        } catch (error) {
            next(error);
        }
    }

    // Update the status of a Customer Dataset
    async updateCustomerDatasetStatus(req, res, next) {
        try {
            const cusDatasetId = req.params.id;

            const updated = await customerDatasetService.updateCustomerDatasetStatus({
                cusDatasetId,
                statusId,
            });

            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            next(error);
        }
    }

    // Xoá dữ liệu training AI cá nhân
    async deleteCustomerDataset(req, res, next) {
        try {
            const cusDatasetId = req.params.id;

            const result = await customerDatasetService.deleteCustomerDataset(cusDatasetId);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    }
}

export default new CustomerDatasetController();

import CustomError from "../../utils/CustomError";
import statusService from "./Status.service";

class StatusController {
    // Lấy tất cả trạng thái
    async getAllStatuses(req, res, next) {
        try {
            const statuses = await statusService.getAllStatuses();
            return res.status(200).json({ success: true, data: statuses });
        } catch (error) {
            next(error);
        }
    }

    // Lấy trạng thái theo ID
    async getStatusById(req, res, next) {
        try {
            const statusId = req.params.id;
            const status = await statusService.getStatusById(statusId);
            return res.status(200).json({ success: true, data: status });
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách trạng thái theo type
    async getStatusByType(req, res, next) {
        try {
            const type = req.query.type;

            if (!type) {
                throw new CustomError("Missing required fields", 400);
            }
            const statuses = await statusService.getStatusByType(type);
            return res.status(200).json({ success: true, data: statuses });
        } catch (error) {
            next(error);
        }
    }

    // Tạo trạng thái mới
    async createStatus(req, res, next) {
        try {
            const { type, name } = req.body;
            const newStatus = await statusService.createStatus(type, name);
            return res.status(201).json({ success: true, data: newStatus });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật tên trạng thái theo ID
    async updateStatus(req, res, next) {
        try {
            const statusId = req.params.id;
            const { type, name } = req.body;
            const updatedStatus = await statusService.updateStatus(statusId, type, name);
            return res.status(200).json({ success: true, data: updatedStatus });
        } catch (error) {
            next(error);
        }
    }

    // Xoá trạng thái theo ID
    async deleteStatus(req, res, next) {
        try {
            const statusId = req.params.id;
            const deletedStatus = await statusService.deleteStatus(statusId);
            return res.status(200).json({ success: true, data: deletedStatus });
        } catch (error) {
            next(error);
        }
    }
}

export default new StatusController();

import CustomError from "../../../utils/CustomError.js";
import channelTypeService from "../services/ChannelType.service.js";

class ChannelTypeController {
    // Lấy tất cả loại dịch vụ
    async getAllChannelTypes(req, res, next) {
        try {
            const channelTypes = await channelTypeService.getAllChannelTypes();
            return res.status(200).json({ success: true, data: channelTypes });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin loại dịch vụ theo Id
    async getChannelTypeById(req, res, next) {
        try {
            const channelTypeId = req.params.id;
            const channelType = await channelTypeService.getChannelTypeById(channelTypeId);
            return res.status(200).json({ success: true, data: channelType });
        } catch (error) {
            next(error);
        }
    }

    // Tạo loại dịch vụ mới
    async createChannelType(req, res, next) {
        try {
            const { name, statusId } = req.body;
            console.log(">>> check: ", req.body);

            const newChannelType = await channelTypeService.createChannelType({ name, statusId });
            return res.status(201).json({ success: true, data: newChannelType });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật loại dịch vụ theo ID
    async updateChannelType(req, res, next) {
        try {
            const channelTypeId = req.params.id;
            const { name, statusId } = req.body;
            const updatedChannelType = await channelTypeService.updateChannelType({
                channelTypeId,
                name,
                statusId,
            });
            return res.status(200).json({ success: true, data: updatedChannelType });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật status của ChannelType
    async updateChannelTypeStatus(req, res, next) {
        try {
            const channelTypeId = req.params.id;
            const { statusId } = req.body;
            const updatedChannelType = await channelTypeService.updateChannelTypeStatus({
                channelTypeId,
                statusId,
            });
            return res.status(200).json({ success: true, data: updatedChannelType });
        } catch (error) {
            next(error);
        }
    }

    // Xoá loại dịch vụ theo ID
    async deleteChannelType(req, res, next) {
        try {
            const channelTypeId = req.params.id;
            const deletedChannelType = await channelTypeService.deleteChannelType(channelTypeId);
            return res.status(200).json({ success: true, data: deletedChannelType });
        } catch (error) {
            next(error);
        }
    }
}

export default new ChannelTypeController();

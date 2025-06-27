import CustomError from "../../../utils/CustomError.js";
import channelService from "../services/Channel.service.js";

class ChannelController {
    // Lấy tất cả kênh cụ thể
    async getAllChannels(req, res, next) {
        try {
            const channels = await channelService.getAllChannels();
            return res.status(200).json({ success: true, data: channels });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin kênh cụ thể theo Id
    async getChannelById(req, res, next) {
        try {
            const channelId = req.params.id;
            const channel = await channelService.getChannelById(channelId);
            return res.status(200).json({ success: true, data: channel });
        } catch (error) {
            next(error);
        }
    }

    // Tạo kênh cụ thể mới
    async createChannel(req, res, next) {
        try {
            const { apiEndpoint, channelTypeId, statusId } = req.body;
            const newChannel = await channelService.createChannel({
                apiEndpoint,
                channelTypeId,
                statusId,
            });
            return res.status(201).json({ success: true, data: newChannel });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật kênh cụ thể theo ID
    async updateChannel(req, res, next) {
        try {
            const channelId = req.params.id;
            const { apiEndpoint, channelTypeId, statusId } = req.body;
            const updatedChannel = await channelService.updateChannel({
                channelId,
                apiEndpoint,
                channelTypeId,
                statusId,
            });
            return res.status(200).json({ success: true, data: updatedChannel });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật status của Channel
    async updateChannelStatus(req, res, next) {
        try {
            const channelId = req.params.id;
            const { statusId } = req.body;
            const updatedChannel = await channelService.updateChannelStatus({
                channelId,
                statusId,
            });
            return res.status(200).json({ success: true, data: updatedChannel });
        } catch (error) {
            next(error);
        }
    }

    // Xoá kênh cụ thể theo ID
    async deleteChannel(req, res, next) {
        try {
            const channelId = req.params.id;
            const deletedChannel = await channelService.deleteChannel(channelId);
            return res.status(200).json({ success: true, data: deletedChannel });
        } catch (error) {
            next(error);
        }
    }
}

export default new ChannelController();

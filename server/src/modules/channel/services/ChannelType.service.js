import repositories from "../../../config/repositoryManager.js";
import CustomError from "../../../utils/CustomError.js";

class ChannelTypeService {
    // Lấy tất cả kênh cụ thể
    async getAllChannels() {
        const channels = await repositories.channel.find({
            relations: ["channelType", "status"],
        });
        return channels;
    }

    // Lấy thông tin kênh cụ thể theo Id
    async getChannelById(channelId) {
        const channel = await repositories.channel.findOne({
            where: { id: channelId },
            relations: ["channelType", "status"],
        });
        if (!channel) {
            throw new CustomError("Channel not found.", 404);
        }
        return channel;
    }

    // Tạo kênh cụ thể mới
    async createChannel(channelData) {
        const { apiEndpoint, channelTypeId, statusId } = channelData;
        const newChannel = repositories.channel.create({
            apiEndpoint,
            channelType: { id: channelTypeId },
            status: { id: statusId },
        });
        await repositories.channel.save(newChannel);
        return newChannel;
    }

    // Cập nhật kênh cụ thể theo ID
    async updateChannel(channelData) {
        const { channelId, apiEndpoint, channelTypeId, statusId } = channelData;

        const existingChannel = await repositories.channel.findOne({ where: { id: channelId } });
        if (!existingChannel) {
            throw new CustomError("Channel not found.", 404);
        }

        const [channelType, status] = await Promise.all([
            repositories.channelType.findOne({ where: { id: channelTypeId } }),
            repositories.status.findOne({ where: { id: statusId } }),
        ]);

        if (!channelType) {
            throw new CustomError("ChannelType not found.", 400);
        }
        if (!status) {
            throw new CustomError("Status not found.", 400);
        }

        existingChannel.apiEndpoint = apiEndpoint;
        existingChannel.channelType = channelType;
        existingChannel.status = status;

        return await repositories.channel.save(existingChannel);
    }

    // Cập nhật status cho Channel
    async updateChannelStatus({ channelId, statusId }) {
        const existingChannel = await repositories.channel.findOne({ where: { id: channelId } });
        if (!existingChannel) {
            throw new CustomError("Channel not found.", 404);
        }

        const status = await repositories.status.findOne({ where: { id: statusId } });
        if (!status) {
            throw new CustomError("Status not found.", 400);
        }

        existingChannel.status = status;
        const updatedChannel = await repositories.channel.save(existingChannel);
        return updatedChannel;
    }

    // Xoá kênh cụ thể theo ID
    async deleteChannel(channelId) {
        const existingChannel = await repositories.channel.findOne({
            where: { id: channelId },
        });

        if (!existingChannel) {
            throw new CustomError("Channel not found.", 404);
        }

        const [messageCount, postCount] = await Promise.all([
            repositories.message.countBy({ channel: { id: channelId } }),
            repositories.post.countBy({ channel: { id: channelId } }),
        ]);

        const isUsed = messageCount > 0 || postCount > 0;

        if (isUsed) {
            throw new CustomError("Cannot delete an Channel that is currently in use.", 400);
        }

        await repositories.channel.remove(existingChannel);
        return { message: "Channel deleted successfully." };
    }

    // --------- CHANNNEL TYPE -----------
    // Lấy tất cả Loại dịch vụ
    async getAllChannelTypes() {
        const channelTypes = await repositories.channelType.find({
            relations: ["status"],
        });
        return channelTypes;
    }

    // Lấy thông tin loại dịch vụ theo Id
    async getChannelTypeById(channelTypeId) {
        const channelType = await repositories.channelType.findOne({
            where: { id: channelTypeId },
            relations: ["status"],
        });
        if (!channelType) {
            throw new CustomError("Channel Type not found.", 404);
        }
        return channelType;
    }

    // Tạo loại dịch vụ  mới
    async createChannelType(channelTypeData) {
        const { name, statusId } = channelTypeData;
        const newChannelType = repositories.channelType.create({
            name,
            status: { id: statusId },
        });
        await repositories.channelType.save(newChannelType);
        return newChannelType;
    }

    // Cập nhật loại dịch vụ theo ID
    async updateChannelType(channelTypeData) {
        const { channelTypeId, name, statusId } = channelTypeData;

        const existingChannelType = await repositories.channelType.findOne({
            where: { id: channelTypeId },
        });

        if (!existingChannelType) {
            throw new CustomError("ChannelType not found.", 404);
        }

        const status = await repositories.status.findOne({
            where: { id: statusId },
        });

        if (!status) {
            throw new CustomError("Status not found.", 400);
        }

        existingChannelType.name = name;
        existingChannelType.status = status;
        return await repositories.channelType.save(existingChannelType);
    }

    // Cập nhật status cho ChannelType
    async updateChannelTypeStatus({ channelTypeId, statusId }) {
        const existingChannelType = await repositories.channelType.findOne({
            where: { id: channelTypeId },
        });
        if (!existingChannelType) {
            throw new CustomError("ChannelType not found.", 404);
        }

        const status = await repositories.status.findOne({ where: { id: statusId } });
        if (!status) {
            throw new CustomError("Status not found.", 400);
        }

        existingChannelType.status = status;
        const updatedChannelType = await repositories.channelType.save(existingChannelType);
        return updatedChannelType;
    }

    // Xóa loại dịch vụ theo ID
    async deleteChannelType(channelTypeId) {
        const existingChannelType = await repositories.channelType.findOne({
            where: { id: channelTypeId },
        });

        if (!existingChannelType) {
            throw new CustomError("ChannelType not found.", 404);
        }

        const isUsedInChannel =
            (await repositories.channel.countBy({ channelType: { id: channelTypeId } })) > 0;

        if (isUsedInChannel) {
            throw new CustomError("Cannot delete a channel type that is currently in use.", 400);
        }

        await repositories.channelType.remove(existingChannelType);
        return { message: "ChannelType deleted successfully." };
    }
}

export default new ChannelTypeService();

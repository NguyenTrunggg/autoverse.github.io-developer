import repositories from "../../config/repositoryManager";
import CustomError from "../../utils/CustomError";

class StatusService {
    // Lấy tất cả trạng thái
    async getAllStatuses() {
        const statuses = await repositories.status.find();
        return statuses;
    }

    // Lấy trạng thái theo ID
    async getStatusById(statusId) {
        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) {
            throw new CustomError(`Status with ID ${statusId} not found`, 404);
        }
        return status;
    }

    // Lấy trạng thái theo Type
    async getStatusByType(type) {
        const statuses = await repositories.status.find({
            where: { type },
        });
        if (statuses.length === 0) {
            throw new CustomError(`No status found with type '${type}'`, 404);
        }
        return statuses;
    }

    // Tạo trạng thái mới
    async createStatus(statusType, statusName) {
        const newStatus = repositories.status.create({ type: statusType, name: statusName });
        const savedStatus = await repositories.status.save(newStatus);
        return savedStatus;
    }

    // Cập nhật trạng thái theo ID
    async updateStatus(statusId, newType, newName) {
        const existingStatus = await repositories.status.findOne({
            where: { id: statusId },
        });

        if (!existingStatus) {
            throw new CustomError("Status not found.", 404);
        }

        existingStatus.type = newType;
        existingStatus.name = newName;
        const updatedStatus = await repositories.status.save(existingStatus);
        return updatedStatus;
    }

    async deleteStatus(statusId) {
        const existingStatus = await repositories.status.findOne({
            where: { id: statusId },
        });

        if (!existingStatus) {
            throw new CustomError("Status not found.", 404);
        }

        const [
            userCount,
            aiModelCount,
            gateWayCount,
            paymentCount,
            postCount,
            messageCount,
            cusDatasetCount,
        ] = await Promise.all([
            repositories.user.countBy({ status: { id: statusId } }),
            repositories.aiModel.countBy({ status: { id: statusId } }),
            repositories.paymentGate.countBy({ status: { id: statusId } }),
            repositories.payment.countBy({ status: { id: statusId } }),
            repositories.post.countBy({ status: { id: statusId } }),
            repositories.message.countBy({ status: { id: statusId } }),
            repositories.cusDataset.countBy({ status: { id: statusId } }),
        ]);

        const isUsed =
            userCount > 0 ||
            aiModelCount > 0 ||
            gateWayCount > 0 ||
            paymentCount > 0 ||
            postCount > 0 ||
            messageCount > 0 ||
            cusDatasetCount > 0;

        if (isUsed) {
            throw new CustomError("Cannot delete a Status that is currently in use.", 400);
        }

        await repositories.status.remove(existingStatus);
        return { message: "Status deleted successfully." };
    }
}

export default new StatusService();

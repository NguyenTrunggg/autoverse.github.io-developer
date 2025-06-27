import repositories from "../../../config/repositoryManager.js";
import CustomError from "../../../utils/CustomError.js";

class PaymentGateWayService {
    // Lấy dang sách cổng thanh toán
    async getAllGateways() {
        return await repositories.paymentGate.find({ relations: ["status"] });
    }

    async getGatewayById(gatewayId) {
        const gateway = await repositories.paymentGate.findOne({
            where: { id: gatewayId },
            relations: ["status"],
        });
        if (!gateway) {
            throw new CustomError("Payment Gateway not found.", 404);
        }
        return gateway;
    }

    // Thêm cổng thanh toán mới
    async createGateway(data) {
        const { name, apiUrl, callbackUrl, clientId, clientSecret, statusId } = data;

        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) throw new CustomError("Status not found.", 400);

        const newGateway = repositories.paymentGate.create({
            name,
            apiUrl,
            callbackUrl,
            clientId,
            clientSecret,
            status,
        });

        return await repositories.paymentGate.save(newGateway);
    }

    // Sửa thông tin cổng thanh toán theo ID
    async updateGateway(data) {
        const { id, name, apiUrl, callbackUrl, clientId, clientSecret, statusId } = data;

        const gateway = await repositories.paymentGate.findOne({
            where: { id },
            relations: ["status"],
        });

        if (!gateway) {
            throw new CustomError("Payment Gateway not found", 404);
        }

        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) throw new CustomError("Status not found.", 400);

        gateway.name = name;
        gateway.apiUrl = apiUrl;
        gateway.callbackUrl = callbackUrl;
        gateway.clientId = clientId;
        gateway.clientSecret = clientSecret;
        gateway.status = status;

        return await repositories.paymentGate.save(gateway);
    }

    // Cập nhật trạng thái Gateway
    async updateGatewayStatus(gatewayId, statusId) {
        const gateway = await repositories.paymentGate.findOne({
            where: { id: gatewayId },
            relations: ["status"],
        });
        if (!gateway) {
            throw new CustomError("Payment Gateway not found", 404);
        }

        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) {
            throw new CustomError("Status not found", 400);
        }

        gateway.status = status;
        return await repositories.paymentGate.save(gateway);
    }

    // Xóa cổng thanh toán theo ID
    async deleteGateway(id) {
        const gateway = await repositories.paymentGate.findOneBy({ id });

        if (!gateway) {
            throw new CustomError("Payment Gateway not found", 404);
        }

        await repositories.paymentGate.remove(gateway);

        return { message: "Payment Gateway deleted successfully." };
    }
}

export default new PaymentGateWayService();

import CustomError from "../../../utils/CustomError.js";
import paymentGateWayService from "../services/PaymentGateWay.service.js";

class PaymentGateWayController {
    // Lấy dang sách cổng thanh toán
    async getAllGateways(req, res, next) {
        try {
            const gateways = await paymentGateWayService.getAllGateways();
            res.status(200).json({ success: true, data: gateways });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin cổng thanh toán chi tiết
    async getGatewayById(req, res, next) {
        try {
            const gatewayId = req.params.id;
            const gateway = await paymentGateWayService.getGatewayById(gatewayId);
            res.status(200).json({ success: true, data: gateway });
        } catch (error) {
            next(error);
        }
    }

    // Thêm cổng thanh toán mới
    async createGateway(req, res, next) {
        try {
            const { name, apiUrl, callbackUrl, clientId, clientSecret, statusId } = req.body;
            const newGateway = await paymentGateWayService.createGateway({
                name,
                apiUrl,
                callbackUrl,
                clientId,
                clientSecret,
                statusId,
            });

            res.status(201).json({ success: true, data: newGateway });
        } catch (error) {
            next(error);
        }
    }

    // Sửa thông tin cổng thanh toán theo ID
    async updateGateway(req, res, next) {
        try {
            const gatewayId = req.params.id;
            const { name, apiUrl, callbackUrl, clientId, clientSecret, statusId } = req.body;
            const updatedGateway = await paymentGateWayService.updateGateway({
                id: gatewayId,
                name,
                apiUrl,
                callbackUrl,
                clientId,
                clientSecret,
                statusId,
            });

            res.status(200).json({ success: true, data: updatedGateway });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật trạng thái cho Gateway
    async updateGatewayStatus(req, res, next) {
        try {
            const gatewayId = req.params.id;
            const { statusId } = req.body;
            const updatedGateway = await paymentGateWayService.updateGatewayStatus(
                gatewayId,
                statusId
            );
            res.status(200).json({ success: true, data: updatedGateway });
        } catch (error) {
            next(error);
        }
    }

    // Xóa cổng thanh toán theo ID
    async deleteGateway(req, res, next) {
        try {
            const gatewayId = req.params.id;
            const result = await paymentGateWayService.deleteGateway(gatewayId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export default new PaymentGateWayController();

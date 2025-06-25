import CustomError from "../../../utils/CustomError";
import paymentMethodService from "../services/PaymentMethod.service";

class PaymentMethodController {
    // Lấy tất cả phương thức thanh toán
    async getAllMethodPays(req, res, next) {
        try {
            const methodPays = await paymentMethodService.getAllMethodPays();
            return res.status(200).json({ success: true, data: methodPays });
        } catch (error) {
            next(error);
        }
    }

    // Lấy phương thức thanh toán chi tiết
    async getMethodPayById(req, res, next) {
        try {
            const methodPayId = req.params.id;
            const methodPay = await paymentMethodService.getMethodPayById(methodPayId);
            return res.status(200).json({ success: true, data: methodPay });
        } catch (error) {
            next(error);
        }
    }

    // Tạo phương thức thanh toán mới
    async createMethodPay(req, res, next) {
        try {
            const { name, statusId } = req.body;
            const newMethodPay = await paymentMethodService.createMethodPay({ name, statusId });
            return res.status(201).json({ success: true, data: newMethodPay });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật phương thức thanh toán theo ID
    async updateMethodPay(req, res, next) {
        try {
            const methodPayId = req.params.id;
            const { name, statusId } = req.body;
            const updatedMethodPay = await paymentMethodService.updateMethodPay({
                methodPayId,
                name,
                statusId,
            });
            return res.status(200).json({ success: true, data: updatedMethodPay });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật trạng thái cho MethodPay
    async updateMethodPayStatus(req, res, next) {
        try {
            const methodPayId = req.params.id;
            const { statusId } = req.body;
            const updatedMethodPay = await paymentMethodService.updateMethodPayStatus(
                methodPayId,
                statusId
            );
            res.status(200).json({ success: true, data: updatedMethodPay });
        } catch (error) {
            next(error);
        }
    }

    // Xoá phương thức thanh toán theo ID
    async deleteMethodPay(req, res, next) {
        try {
            const methodPayId = req.params.id;
            const deletedMethodPay = await paymentMethodService.deleteMethodPay(methodPayId);
            return res.status(200).json({ success: true, data: deletedMethodPay });
        } catch (error) {
            next(error);
        }
    }
}

export default new PaymentMethodController();

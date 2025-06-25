import paymentService from "../services/Payment.service";

class PaymentController {
    // Lấy danh sách lịch sử thanh toán
    async getAllPayments(req, res, next) {
        try {
            const payments = await paymentService.getAllPayments();
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch sử thanh toán chi tiết theo ID
    async getPaymentById(req, res, next) {
        try {
            const payId = req.params.id;
            const payment = await paymentService.getPaymentById(payId);
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            next(error);
        }
    }

    // Lấy lịch sử thanh toán chi tiết theo ID
    async getPaymentByUser(req, res, next) {
        try {
            const userId = req.params.id;
            const payments = await paymentService.getPaymentByUser(userId);
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            next(error);
        }
    }

    // Lưu lịch sử thanh toán mới
    async createPayment(req, res, next) {
        try {
            const { userId, paymentMethodId, amount, transactionId } = req.body;
            const newPayment = await paymentService.createPayment({
                userId,
                paymentMethodId,
                amount,
                transactionId,
            });
            res.status(201).json({ success: true, data: newPayment });
        } catch (error) {
            next(error);
        }
    }

    // Sửa lịch sử thanh toán theo ID
    async updatePayment(req, res, next) {
        try {
            const paymentId = parseInt(req.params.id);
            const { userId, paymentMethodId, amount, transactionId, statusId } = req.body;
            const updatedPayment = await paymentService.updatePayment(paymentId, {
                userId,
                paymentMethodId,
                amount,
                transactionId,
                statusId,
            });
            res.status(200).json({ success: true, data: updatedPayment });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật trạng thái cho Payment
    async updatePaymentStatus(req, res, next) {
        try {
            const id = req.params.id;
            const { statusId } = req.body;
            const updatedPayment = await paymentService.updatePaymentStatus(id, statusId);
            res.status(200).json({ success: true, data: updatedPayment });
        } catch (error) {
            next(error);
        }
    }

    // Xóa lịch sử thanh toán theo ID
    async deletePayment(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await paymentService.deletePayment(id);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export default new PaymentController();

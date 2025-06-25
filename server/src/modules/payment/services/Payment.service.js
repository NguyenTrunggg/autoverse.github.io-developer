import repositories from "../../../config/repositoryManager";
import CustomError from "../../../utils/CustomError";

class PaymentService {
    // Lấy danh sách lịch sử thanh toán
    async getAllPayments() {
        const payments = await repositories.payment.find({
            relations: ["user", "paymentMethod", "status"],
            order: { id: "DESC" },
        });
        return payments;
    }

    // Lấy lịch sử thanh toán chi tiết theo ID
    async getPaymentById(payId) {
        const payment = await repositories.payment.findOne({
            where: { id: payId },
            relations: ["user", "paymentMethod", "status"],
        });
        if (!payment) {
            throw new CustomError("Payment not found.", 404);
        }
        return payment;
    }

    // Lấy lịch sử thanh toán chi tiết theo User
    async getPaymentByUser(userId) {
        const payments = await repositories.payment.find({
            where: { user: { id: userId } },
            relations: ["user", "paymentMethod", "status"],
        });
        return payments;
    }

    // Lưu lịch sử thanh toán mới
    async createPayment({ userId, paymentMethodId, amount, transactionId }) {
        const user = await repositories.user.findOneBy({ id: userId });
        if (!user) throw new CustomError("User not found", 404);

        const paymentMethod = await repositories.methodPay.findOneBy({ id: paymentMethodId });
        if (!paymentMethod) throw new CustomError("Payment Method not found", 404);

        const status = await repositories.status.findOne({
            where: { type: "PAYMENT", name: "pending" },
        });
        if (!status) status = await repositories.status.save({ type: "PAYMENT", name: "pending" });

        const newPayment = repositories.payment.create({
            user,
            paymentMethod,
            amount,
            transactionId,
            status,
        });

        await repositories.payment.save(newPayment);
        return newPayment;
    }

    // Sửa lịch sử thanh toán theo ID
    async updatePayment(id, { userId, paymentMethodId, amount, transactionId, statusId }) {
        const payment = await repositories.payment.findOne({
            where: { id },
            relations: ["user", "paymentMethod", "status"],
        });
        if (!payment) throw new CustomError("Payment not found", 404);

        const [user, paymentMethod, status] = await Promise.all([
            repositories.user.findOneBy({ id: userId }),
            repositories.methodPay.findOneBy({ id: paymentMethodId }),
            repositories.status.findOneBy({ id: statusId }),
        ]);

        if (!user) throw new CustomError("User not found", 404);
        if (!paymentMethod) throw new CustomError("Payment method not found", 404);
        if (!status) throw new CustomError("Status not found", 400);

        payment.user = user;
        payment.paymentMethod = paymentMethod;
        payment.amount = amount;
        payment.transactionId = transactionId;
        payment.status = status;

        return await repositories.payment.save(payment);
    }

    // Cập nhật trạng thái Payment
    async updatePaymentStatus(id, statusId) {
        const payment = await repositories.payment.findOne({
            where: { id },
            relations: ["status"],
        });
        if (!payment) {
            throw new CustomError("Payment not found", 404);
        }

        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) {
            throw new CustomError("Status not found", 400);
        }

        payment.status = status;
        return await repositories.payment.save(payment);
    }

    // Xóa lịch sử thanh toán theo ID
    async deletePayment(id) {
        const payment = await repositories.payment.findOneBy({ id });
        if (!payment) throw new CustomError("Payment not found", 404);
        await repositories.payment.remove(payment);
        return { message: "Payment deleted successfully." };
    }
}

export default new PaymentService();

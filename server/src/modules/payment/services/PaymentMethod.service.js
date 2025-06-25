import repositories from "../../../config/repositoryManager";
import CustomError from "../../../utils/CustomError";

class PaymentMethodService {
    // Lấy tất cả các phương thức thanh toán
    async getAllMethodPays() {
        const methodPays = await repositories.methodPay.find({
            relations: ["status"],
        });
        return methodPays;
    }

    // Lấy phương thức thanh toán chi tiết
    async getMethodPayById(methodPayId) {
        const methodPay = await repositories.methodPay.findOne({
            where: { id: methodPayId },
            relations: ["status"],
        });
        if (!methodPay) {
            throw new CustomError("MethodPay not found.", 404);
        }
        return methodPay;
    }

    // Tạo phương thức thanh toán mới
    async createMethodPay(methodPayData) {
        const { name, statusId } = methodPayData;
        const newMethodPay = repositories.methodPay.create({
            name,
            status: { id: statusId },
        });
        await repositories.methodPay.save(newMethodPay);
        return newMethodPay;
    }

    // Cập nhật phương thức thanh toán theo ID
    async updateMethodPay(methodPayData) {
        const { methodPayId, name, statusId } = methodPayData;

        const existingMethodPay = await repositories.methodPay.findOne({
            where: { id: methodPayId },
        });

        if (!existingMethodPay) {
            throw new CustomError("Payment Method not found.", 404);
        }

        const status = await repositories.status.findOne({
            where: { id: statusId },
        });

        if (!status) {
            throw new CustomError("Status not found.", 400);
        }

        existingMethodPay.name = name;
        existingMethodPay.status = status;
        return await repositories.methodPay.save(existingMethodPay);
    }

    // Cập nhật trạng thái MethodPay
    async updateMethodPayStatus(methodPayId, statusId) {
        const methodPay = await repositories.methodPay.findOne({
            where: { id: methodPayId },
            relations: ["status"],
        });
        if (!methodPay) {
            throw new CustomError("Payment Method not found", 404);
        }

        const status = await repositories.status.findOneBy({ id: statusId });
        if (!status) {
            throw new CustomError("Status not found", 400);
        }

        methodPay.status = status;
        return await repositories.methodPay.save(methodPay);
    }

    // Xóa phương thức thanh toán theo ID
    async deleteMethodPay(methodPayId) {
        const existingMethodPay = await repositories.methodPay.findOne({
            where: { id: methodPayId },
        });

        if (!existingMethodPay) {
            throw new CustomError("Payment Method not found.", 404);
        }

        const isUsedInPayment =
            (await repositories.payment.countBy({ method: { id: methodPayId } })) > 0;

        if (isUsedInPayment) {
            throw new CustomError("Cannot delete a payment method that is currently in use.", 400);
        }

        await repositories.methodPay.remove(existingMethodPay);
        return { message: "Payment Method deleted successfully." };
    }
}

export default new PaymentMethodService();

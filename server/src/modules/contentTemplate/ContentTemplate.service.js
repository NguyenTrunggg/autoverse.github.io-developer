import CustomError from "../../utils/CustomError";
import repositories from "../../config/repositoryManager";

class ContentTemplateService {
    // Lấy danh sách tất cả nội dung mẫu
    async getAllConTemplates(page, limit) {
        const [result, total] = await repositories.conTemplate
            .createQueryBuilder("conTemplate")
            .leftJoinAndSelect("conTemplate.user", "user")
            .leftJoinAndSelect("conTemplate.aiModel", "aiModel")
            .leftJoinAndSelect("conTemplate.images", "images")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items: result,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Lấy thông tin nội dung mẫu theo ID
    async getConTemplateById(conTemplateId) {
        const conTemplate = await repositories.conTemplate.findOne({
            where: { id: conTemplateId },
            relations: ["user", "aiModel", "images"],
        });
        if (!conTemplate) {
            throw new CustomError("Content Template not found.", 404);
        }
        return conTemplate;
    }

    // Tạo mới nội dung mẫu
    async createConTemplate(conTemplateData) {
        const { title, body, userId, aiModelId } = conTemplateData;

        const newContentTemplate = repositories.conTemplate.create({
            title: title,
            body: body,
            user: { id: userId },
            aiModel: { id: aiModelId },
        });

        return await repositories.conTemplate.save(newContentTemplate);
    }

    // Cập nhật nội dung mẫu
    // async updateConTemplate(data) {
    //     const { conTemplateId, title, body, userId, aiModelId, imageUrls } = data;

    //     const template = await repositories.conTemplate.findOne({
    //         where: { id: conTemplateId },
    //         relations: ["user", "aiModel", "images"],
    //     });
    //     if (!template) throw new CustomError("Template not found", 404);

    //     if (userId) {
    //         const user = await repositories.user.findOne({ where: { id: userId } });
    //         if (!user) throw new CustomError("User not found", 404);
    //         template.user = user;
    //     }

    //     if (aiModelId) {
    //         const aiModel = await repositories.aiModel.findOne({ where: { id: aiModelId } });
    //         if (!aiModel) throw new CustomError("AI Model not found", 404);
    //         template.aiModel = aiModel;
    //     }

    //     template.title = title;
    //     template.body = body;

    //     // Thêm ảnh mới nếu có
    //     if (imageUrls && imageUrls.length > 0) {
    //         const newImages = imageUrls.map((url) =>
    //             repositories.conTemplateImage.create({
    //                 imageUrl: url,
    //                 template: template,
    //             })
    //         );

    //         // Gộp ảnh cũ + ảnh mới
    //         template.images = [...(template.images || []), ...newImages];
    //     }

    //     return await repositories.conTemplate.save(template);
    // }

    // Cập nhật nội dung mẫu
    async updateConTemplate(data) {
        const { conTemplateId, title, body, userId, aiModelId, imageUrls } = data;

        const template = await repositories.conTemplate.findOne({
            where: { id: conTemplateId },
            relations: ["user", "aiModel", "images"],
        });

        if (!template) throw new CustomError("Template not found", 404);

        if (typeof userId !== "undefined") {
            const user = await repositories.user.findOne({ where: { id: userId } });
            if (!user) throw new CustomError("User not found", 404);
            template.user = user;
        }

        if (typeof aiModelId !== "undefined") {
            const aiModel = await repositories.aiModel.findOne({ where: { id: aiModelId } });
            if (!aiModel) throw new CustomError("AI Model not found", 404);
            template.aiModel = aiModel;
        }

        // ✅ Chỉ cập nhật nếu khác undefined và khác ""
        if (typeof title !== "undefined" && title.trim() !== "") {
            template.title = title;
        }

        if (typeof body !== "undefined" && body.trim() !== "") {
            template.body = body;
        }

        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            await repositories.conTemplateImage.delete({
                template: { id: conTemplateId },
            });

            const newImages = imageUrls.map((url) =>
                repositories.conTemplateImage.create({
                    imageUrl: url,
                    template: template,
                })
            );

            template.images = newImages;
        }

        return await repositories.conTemplate.save(template);
    }

    // Xoá nội dung mẫu theo ID
    async deleteConTemplate(conTemplateId) {
        const conTemplate = await repositories.conTemplate.findOne({
            where: { id: conTemplateId },
        });

        if (!conTemplate) {
            throw new CustomError("Content Template not found.", 404);
        }

        const isUsedInPost =
            (await repositories.post.countBy({
                template: { id: conTemplateId },
            })) > 0;

        if (isUsedInPost) {
            throw new CustomError(
                "Cannot delete a content template that is currently in use.",
                400
            );
        }

        await repositories.conTemplate.remove(conTemplate);
        return { message: "Content Template deleted successfully" };
    }
}

export default new ContentTemplateService();

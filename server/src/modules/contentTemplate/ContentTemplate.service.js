import CustomError from "../../utils/CustomError.js";
import repositories from "../../config/repositoryManager.js";

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

    async updateConTemplate(data) {
        const { conTemplateId, title, body, userId, aiModelId, imageBody, imageUrls } = data;

        console.log("imageBody from request:", imageBody);
        console.log("typeof imageBody:", typeof imageBody);

        const template = await repositories.conTemplate.findOne({
            where: { id: conTemplateId },
            relations: ["user", "aiModel", "images"], // cần lấy cả images
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

        if (typeof title !== "undefined" && title.trim() !== "") {
            template.title = title;
        }

        if (typeof body !== "undefined" && body.trim() !== "") {
            template.body = body;
        }

        // --- Xử lý ảnh ---
        const imagesToKeep = Array.isArray(imageBody) ? imageBody : [];
        const imagesToKeepSet = new Set(imagesToKeep);

        // 1. Lọc lại các ảnh muốn giữ
        const currentImages = template.images || [];
        const filteredImages = currentImages.filter((img) => imagesToKeepSet.has(img.imageUrl));

        // 2. Xác định các ảnh cần xoá
        const imagesToDelete = currentImages.filter((img) => !imagesToKeepSet.has(img.imageUrl));
        const imageIdsToDelete = imagesToDelete.map((img) => img.id);

        if (imageIdsToDelete.length > 0) {
            await repositories.conTemplateImage.delete(imageIdsToDelete);
        }

        // 3. Thêm ảnh mới từ imageUrls
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            const newImageEntities = imageUrls.map((url) =>
                repositories.conTemplateImage.create({
                    imageUrl: url,
                    template: template,
                })
            );
            const savedNewImages = await repositories.conTemplateImage.save(newImageEntities);
            template.images = [...filteredImages, ...savedNewImages];
        } else {
            // Nếu không có ảnh mới, chỉ giữ ảnh cũ đã lọc
            template.images = filteredImages;
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

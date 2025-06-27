import repositories from "../../config/repositoryManager.js";
import CustomError from "../../utils/CustomError.js";

class PostService {
    async getAllPosts() {
        return await repositories.post.find({
            relations: [
                "user",
                "template",
                "template.images",
                "channel",
                "status",
                "socialIntegration",
            ],
        });
    }

    // Lấy nội dung mẫu trong lịch đăng theo tài khoản bên thứ 3
    async getConTemplateBySocial(socialId, page = 1, limit = 10) {
        const qb = repositories.post
            .createQueryBuilder("post")
            .innerJoin("post.socialIntegration", "social")
            .innerJoinAndSelect("post.template", "template")
            .leftJoinAndSelect("template.aiModel", "aiModel")
            .leftJoinAndSelect("post.status", "status")
            .leftJoinAndSelect("template.images", "images")
            .where("social.id = :socialId", { socialId })
            .andWhere("status.name = :statusName", { statusName: "pending" })
            .andWhere("status.type = :statusType", { statusType: "POST" })
            .skip((page - 1) * limit)
            .take(limit);

        const [posts, total] = await qb.getManyAndCount();

        // Chuyển kết quả thành mảng contentTemplate + status

        const result = posts.map((post) => ({
            id: post.template.id,
            title: post.template.title,
            body: post.template.body,
            imageUrl: post.template.imageUrl, // ảnh đại diện chính
            images: post.template.images || [], // các ảnh phụ nếu có
            createdAt: post.template.createdAt,
            postId: post.id,
            aiModel: post.template.aiModel,
            status: post.status,
            scheduledDate: post.scheduledDate,
            scheduledHour: post.scheduledHour,
        }));

        return {
            items: result,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getPostById(id) {
        const post = await repositories.post.findOne({
            where: { id },
            relations: ["user", "template", "channel", "status", "socialIntegration"],
        });
        if (!post) throw new CustomError("Post not found", 400);
        return post;
    }

    async createPost(data) {
        const {
            userId,
            templateId,
            channelId,
            socialIntegrationId,
            statusId,
            scheduledDate,
            scheduledHour,
        } = data;

        const [userEntity, templateEntity, channelEntity, socialInEntity, statusEntity] =
            await Promise.all([
                repositories.user.findOneBy({ id: userId }),
                repositories.conTemplate.findOneBy({ id: templateId }),
                repositories.channel.findOneBy({ id: channelId }),
                repositories.socialIntegration.findOneBy({
                    id: socialIntegrationId,
                }),
                repositories.status.findOneBy({ id: statusId }),
            ]);

        if (!userEntity) throw new CustomError("User not found", 400);
        if (!templateEntity) throw new CustomError("Template not found", 400);
        if (!channelEntity) throw new CustomError("Channel not found", 400);
        if (!socialInEntity) throw new CustomError("Social Intergration account not found", 400);
        if (!statusEntity) throw new CustomError("Status not found", 400);

        const newPost = repositories.post.create({
            user: userEntity,
            template: templateEntity,
            channel: channelEntity,
            socialIntegration: socialInEntity,
            status: statusEntity,
            scheduledDate,
            scheduledHour,
        });

        return await repositories.post.save(newPost);
    }

    async updatePost(id, data) {
        const post = await this.getPostById(id);

        const {
            templateId,
            channelId,
            socialIntegrationId,
            statusId,
            scheduledDate,
            scheduledHour,
        } = data;

        // Chạy song song các truy vấn cần thiết
        const [templateEntity, channelEntity, socialIntegration, statusEntity] = await Promise.all([
            templateId
                ? repositories.conTemplate.findOneBy({ id: templateId })
                : Promise.resolve(null),
            channelId ? repositories.channel.findOneBy({ id: channelId }) : Promise.resolve(null),
            socialIntegrationId
                ? repositories.socialIntegration.findOneBy({
                      id: socialIntegrationId,
                  })
                : Promise.resolve(null),
            statusId ? repositories.status.findOneBy({ id: statusId }) : Promise.resolve(null),
        ]);

        if (templateId && !templateEntity) throw new CustomError("Template not found", 400);
        if (channelId && !channelEntity) throw new CustomError("Channel not found", 400);
        if (socialIntegrationId && !socialIntegration)
            throw new CustomError("Social Integration not found", 400);
        if (statusId && !statusEntity) throw new CustomError("Status not found", 400);

        // Gán lại các entity nếu có
        if (templateEntity) post.template = templateEntity;
        if (channelEntity) post.channel = channelEntity;
        if (statusEntity) post.status = statusEntity;
        if (scheduledDate) post.scheduledDate = scheduledDate;
        if (scheduledHour) post.scheduledHour = scheduledHour;

        return await repositories.post.save(post);
    }

    async updatePostStatus(id, statusId) {
        const post = await this.getPostById(id);

        const statusEntity = await repositories.status.findOneBy({
            id: statusId,
        });
        if (!statusEntity) throw new CustomError("Status not found", 400);

        post.status = statusEntity;
        return await repositories.post.save(post);
    }

    async deletePost(id) {
        const post = await this.getPostById(id);
        return await repositories.post.remove(post);
    }
}

export default new PostService();

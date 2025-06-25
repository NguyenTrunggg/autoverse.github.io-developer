import postService from "./Post.service";
import CustomError from "../../utils/CustomError";

class PostController {
    async getAllPosts(req, res, next) {
        try {
            const posts = await postService.getAllPosts();
            res.json({ success: true, data: posts });
        } catch (err) {
            next(err);
        }
    }

    // Lấy nội dung mẫu theo tài khoản bên thứ 3
    async getConTemplateBySocial(req, res, next) {
        try {
            const socialId = req.params.socialId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const conTemplates = await postService.getConTemplateBySocial(socialId, page, limit);
            return res.status(200).json({ success: true, data: conTemplates });
        } catch (error) {
            next(error);
        }
    }

    async getPostById(req, res, next) {
        try {
            const post = await postService.getPostById(parseInt(req.params.id));
            res.json({ success: true, data: post });
        } catch (err) {
            next(err);
        }
    }

    async createPost(req, res, next) {
        try {
            const newPost = await postService.createPost(req.body);
            res.status(201).json({ success: true, data: newPost });
        } catch (err) {
            next(err);
        }
    }

    async updatePost(req, res, next) {
        try {
            const updatedPost = await postService.updatePost(parseInt(req.params.id), req.body);
            res.json({ success: true, data: updatedPost });
        } catch (err) {
            next(err);
        }
    }

    async updatePostStatus(req, res, next) {
        try {
            const updatedPost = await postService.updatePostStatus(
                parseInt(req.params.id),
                req.body.statusId
            );
            res.json({ success: true, data: updatedPost });
        } catch (err) {
            next(err);
        }
    }

    async deletePost(req, res, next) {
        try {
            const result = await postService.deletePost(parseInt(req.params.id));
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

export default new PostController();

import express from "express";
import postController from "./Post.controller";
import validate from "../../middlewares/validateMiddleware.js";
import { createPostSchema, updatePostSchema, updatePostStatusSchema } from "./Post.validator.js";
import { checkUserJWT } from "../../middlewares/authMiddleware";

const router = express.Router();

const postRoute = (app) => {
    router.get("/", postController.getAllPosts);

    router.get("/get-by-id/:id", postController.getPostById);

    router.get("/get-by-social/:socialId", checkUserJWT, postController.getConTemplateBySocial);

    router.post("/", checkUserJWT, validate(createPostSchema), postController.createPost);

    router.put("/:id", checkUserJWT, validate(updatePostSchema), postController.updatePost);

    router.patch(
        "/update-status/:id",
        checkUserJWT,
        validate(updatePostStatusSchema),
        postController.updatePostStatus
    );

    router.delete("/:id", checkUserJWT, postController.deletePost);

    return app.use("/post", router);
};

export default postRoute;

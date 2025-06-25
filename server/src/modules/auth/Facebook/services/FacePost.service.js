import axios from "axios";
import FormData from "form-data";
import https from "https";
import CustomError from "../../../../utils/CustomError.js";
import repositories from "../../../../config/repositoryManager.js";
import FaceTokenService from "./FaceToken.service.js";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

class FacePostService {
    async publishPostToPage({ pageId, pageAccessToken, aiContent }) {
        // Kiểm tra token fanpage còn hiệu lực không
        if (!(await FaceTokenService.verifyPageAccessToken(pageAccessToken))) {
            throw new CustomError("Page access token is invalid or expired", 401);
        }

        // Tách link media trong nội dung bài viết
        const mediaUrls = this.extractMediaUrls(aiContent.body);
        // Tạo nội dung tin nhắn post
        const message = this.formatPostMessage(aiContent.title, aiContent.body);
        //Ảnh trong table content-images
        const contentImageUrls = (aiContent.images || []).map((img) => img.imageUrl);

        // Phân loại media thành video và ảnh
        const videoUrls = mediaUrls.filter((url) => /\.(mp4|mov|avi)$/i.test(url));
        const imageUrls = [
            ...mediaUrls.filter((url) => /\.(jpg|jpeg|png|gif)$/i.test(url)),
            ...contentImageUrls,
        ];

        const attachedMedia = [];

        // Upload ảnh lên Facebook, thu media id
        for (const url of imageUrls) {
            try {
                const mediaId = await this.uploadPhotoToFacebook(url, pageId, pageAccessToken);
                attachedMedia.push({ media_fbid: mediaId });
            } catch (err) {
                console.warn(`Failed to upload photo: ${url}`, err.response?.data || err.message);
            }
        }

        // Nếu có video và có ảnh thì post feed kèm ảnh, video link trong message
        if (videoUrls.length > 0 && attachedMedia.length > 0) {
            const videoLink = videoUrls[0];
            const messageWithVideo = message + `\n\n🎥 Watch video: ${videoLink}`;

            const payload = {
                message: messageWithVideo,
                access_token: pageAccessToken,
                ...(attachedMedia.length > 0 && { attached_media: attachedMedia }),
            };

            const postRes = await axios.post(
                `https://graph.facebook.com/v19.0/${pageId}/feed`,
                payload
            );
            return postRes.data;
        }

        // Nếu chỉ có video thì đăng video luôn
        if (videoUrls.length > 0) {
            const videoUrl = videoUrls[0];
            return await this.uploadVideoToFacebook(videoUrl, pageId, pageAccessToken, message);
        }

        // Nếu không có video thì đăng bài bình thường với ảnh đính kèm
        const payload = {
            message,
            access_token: pageAccessToken,
            ...(attachedMedia.length > 0 && { attached_media: attachedMedia }),
        };

        const postRes = await axios.post(
            `https://graph.facebook.com/v19.0/${pageId}/feed`,
            payload
        );
        return postRes.data;
    }

    extractMediaUrls(text) {
        const regex = /(https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|mp4|mov|avi)(\?[^\s]*)?)/gi;
        return text.match(regex) || [];
    }

    formatPostMessage(title, body) {
        const cleaned = body
            .replace(/(https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|mp4|mov|avi)(\?[^\s]*)?)/gi, "")
            .trim();
        return `📢 ${title}\n\n${cleaned}`.trim();
    }

    async uploadPhotoToFacebook(photoUrl, pageId, pageAccessToken) {
        try {
            const response = await axios.get(photoUrl, { responseType: "arraybuffer", httpsAgent });

            const form = new FormData();
            form.append("source", Buffer.from(response.data), { filename: "image.jpg" });
            form.append("published", "false");
            form.append("access_token", pageAccessToken);

            const res = await axios.post(
                `https://graph.facebook.com/v19.0/${pageId}/photos`,
                form,
                {
                    headers: form.getHeaders(),
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                }
            );

            return res.data.id;
        } catch (err) {
            throw new CustomError(
                `Failed to upload photo: ${err.response?.data?.error?.message || err.message}`,
                400
            );
        }
    }

    async uploadVideoToFacebook(videoUrl, pageId, pageAccessToken, description) {
        try {
            const response = await axios.get(videoUrl, { responseType: "arraybuffer", httpsAgent });

            const form = new FormData();
            form.append("source", Buffer.from(response.data), { filename: "video.mp4" });
            form.append("description", description);
            form.append("access_token", pageAccessToken);
            form.append("published", "true");

            const res = await axios.post(
                `https://graph.facebook.com/v19.0/${pageId}/videos`,
                form,
                {
                    headers: form.getHeaders(),
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                }
            );

            return res.data;
        } catch (err) {
            throw new CustomError(
                `Failed to upload video: ${err.response?.data?.error?.message || err.message}`,
                400
            );
        }
    }
}

export default new FacePostService();

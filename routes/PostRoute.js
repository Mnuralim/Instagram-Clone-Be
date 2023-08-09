import express from "express";
import { alreadyLiked, createPost, deletePost, getAllMyPost, getAllPost, getMyPostById, getNumberoFLike, getOtherUserPost, getPostById, likes, updatePost } from "../controllers/Post.js";
import { upload } from "../middleware/uploadFile.js";
import { isLogin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", isLogin, upload.single("post"), createPost);
router.get("/", isLogin, getAllPost);
router.get("/my-post", isLogin, getAllMyPost);
router.get("/:id", isLogin, getPostById);
router.get("/my-post/:id", isLogin, getMyPostById);
router.get("/otheruser-post/:username", isLogin, getOtherUserPost);
router.put("/:id", isLogin, updatePost);
router.delete("/:id", isLogin, deletePost);
router.put("/likes/:id", isLogin, likes);
router.get("/likes/:id", isLogin, alreadyLiked);
router.get("/total-likes/:id", isLogin, getNumberoFLike);

export default router;

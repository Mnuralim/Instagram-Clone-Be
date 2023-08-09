import express from "express";
import { createComment, deleteComment, getAllComment } from "../controllers/Comment.js";
import { isLogin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/:postId", isLogin, createComment);
router.get("/:postId", isLogin, getAllComment);
router.delete("/:id", isLogin, deleteComment);

export default router;

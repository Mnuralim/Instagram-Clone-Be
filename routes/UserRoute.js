import express from "express";
import { findUserById, follow, getAllUsers, getDataFollow, getMyProfileData, register, updateUser } from "../controllers/User.js";
import { upload } from "../middleware/uploadFile.js";
import { isLogin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/", isLogin, getAllUsers);
router.get("/profile", isLogin, getMyProfileData);
router.put("/", isLogin, upload.single("image"), updateUser);
router.get("/:username", isLogin, findUserById);
router.post("/follow/:username", isLogin, follow);
router.get("/follow/:username", isLogin, getDataFollow);

export default router;

import express from "express";
import { logOut, login, refreshToken } from "../controllers/Auth.js";
import { isLogin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.delete("/logout", isLogin, logOut);
router.post("/refresh-token", refreshToken);

export default router;

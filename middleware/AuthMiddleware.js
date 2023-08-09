import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const isLogin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //token validation
  if (!token) return res.status(401).json({ message: "There is no token" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "access forbidden, login Please" });

    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  });
};

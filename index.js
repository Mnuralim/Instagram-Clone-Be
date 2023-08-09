import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import CommentRoute from "./routes/CommentRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();
db();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(cookieParser());
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/comment", CommentRoute);
app.use(AuthRoute);

app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`));

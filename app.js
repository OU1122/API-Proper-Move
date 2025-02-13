import express from "express";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/user.route.js";
const port = 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(port, () => {
	console.log("server is running on port 8080");
});

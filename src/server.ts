import * as dotenv from "dotenv";
import { VideoRouters } from "./routes/video/VideoRoutes";
import express from "express";

const app = express();
app.use(express.json());
dotenv.config();

app.use(VideoRouters);

app.listen(process.env.PORT || 3333);
import * as dotenv from "dotenv";
import { VideoRouters } from "./routes/video/VideoRoutes";
import express from "express";
import { RedisManager } from "./infra/RedisManager";

const app = express();
app.use(express.json());
dotenv.config();
RedisManager.init();

app.use(VideoRouters);

app.listen(process.env.PORT || 3333);
import { Router } from "express";
import cors from "cors";
import { FetchPopularController } from "../../useCases/video/popular/FetchPopularController";
import { FetchVideoController } from "../../useCases/video/video/FetchVideoController";

const VideoRouters = Router();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200
}

VideoRouters.use(cors(corsOptions));

const fetchVideoController = new FetchVideoController();
const fetchPopularController = new FetchPopularController();

VideoRouters.get("/video", fetchVideoController.handle);
VideoRouters.get("/popular", fetchPopularController.handle);

export { VideoRouters };
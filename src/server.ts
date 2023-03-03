import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import { VideoRouters } from "./routes/video/VideoRoutes";
import { RedisManager } from "./infra/RedisManager";
import { AppError } from "./errors/AppError";

const app = express();
app.use(express.json());
dotenv.config();
RedisManager.init();

app.use(VideoRouters);
app.use(
  (
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    
    return response.status(500).json({
      status: "error",
      message: `Internal server error: ${err.message}`,
    });
  }
);

app.listen(process.env.PORT || 3333);
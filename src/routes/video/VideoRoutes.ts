import { Router, Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { FetchPopularController } from "../../useCases/video/popular/FetchPopularController";

const VideoRouters = Router();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200
}

VideoRouters.use(cors(corsOptions));

VideoRouters.get("/video", async function(req: Request, res: Response): Promise<Response> {
    const requestOptions = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id: req.query.id },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST
        }
    }
    if (requestOptions.params.id) {
      try {
        const response = await axios.request(requestOptions);
        return res.status(response.status).json(response.data);
      } catch (error: any) {
        if (error.response.status === 429) {
          return res.status(429).send({
            message: "The daily download limit has been exceeded"
          });
        }

        return res.status(500).send({
          message: "Something went wrong with the server"
        });
      }
    } else {
      return res.status(400).send({
        "message": "Video id missing"
      });
    }
});

const fetchPopularController = new FetchPopularController();

VideoRouters.get("/popular", fetchPopularController.handle);

export { VideoRouters };
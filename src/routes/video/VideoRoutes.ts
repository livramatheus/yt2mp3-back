import { Router, Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const VideoRouters = Router();

const corsOptions = {
  origin: 'https://yt-2-mp3.netlify.app',
  optionsSuccessStatus: 200
}

VideoRouters.get("/video", cors(corsOptions), async function(req: Request, res: Response): Promise<Response> {
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
        return res.json(response.data).status(response.status).send();
      } catch (error: any) {
        console.log(error.message);

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

export { VideoRouters };
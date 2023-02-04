import { Router, Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const VideoRouters = Router();

const corsOptions = {
  origin: 'https://yt-2-mp3.netlify.app',
  optionsSuccessStatus: 200
}

VideoRouters.get("/video", cors(corsOptions),async function(req: Request, res: Response) {
    const requestOptions = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id: req.query.id },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': process.env.RAPID_API_HOST
        }
    }

    const response = await axios.request(requestOptions);
    res.json(response.data).send();

});

export { VideoRouters };
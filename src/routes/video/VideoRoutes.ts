import { Router, Request, Response } from "express";
import axios from "axios";

const VideoRouters = Router();

VideoRouters.get("/video", async function(req: Request, res: Response) {
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
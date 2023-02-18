import { Router, Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { RedisManager } from "../../infra/RedisManager";

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

VideoRouters.get("/popular", async function(req: Request, res: Response): Promise<Response> {
  const requestOptions = {
    method: 'GET',
    url: 'https://youtube-search-results.p.rapidapi.com/youtube-search/',
    params: { q: '2023 song' },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_YT_SEARCH_HOST
    }
  };

  const client = await RedisManager.getInstance();
  const cachedSongs = await client.get('songs');

  const prepareResponseArray = (songs: []): object[] => {
    const shuffled = songs.sort(function () {
      return Math.random() - 0.5;
    });

    return shuffled.slice(0, 4)
  }
  
  if (cachedSongs) {
    const shuffled = prepareResponseArray(JSON.parse(cachedSongs));
    return res.json({ songs: shuffled });
  }

  const response = await axios.request(requestOptions);

  if (response.status === 200) {
    const youtubeData = response.data.items.filter((i: any) => {
      return i.title === "Popular today";
    });
    
    if (!youtubeData[0].items) {
      return res.status(500).json({
        message: "Internal server error"
      });
    }

    const songs = youtubeData[0].items;

    if (!songs.length) {
      return res.status(500).json({
        message: "Internal server error"
      });
    }

    await client.set('songs', JSON.stringify(songs), {
      EX: 6 * 60 * 60,
      NX: true
    });
    
    return res.json({ songs: prepareResponseArray(songs) });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
});

export { VideoRouters };
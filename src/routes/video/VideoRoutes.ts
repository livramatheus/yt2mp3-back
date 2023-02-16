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
        return res.json(response.data).status(response.status).send();
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
    params: { q: 'music' },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_YT_SEARCH_HOST
    }
  };

  const client = await RedisManager.getInstance();
  const cachedSongs = await client.get('songs');
  
  if (cachedSongs) {
    return res.json({ songs: JSON.parse(cachedSongs) }).status(200).send();
  }

  const response = await axios.request(requestOptions);

  if (response.status === 200) {
    const youtubeData = response.data.items.filter((i: any) => {
      return i.title === "Popular today";
    });
    
    if (!youtubeData[0].items) {
      return res.json({
        message: "Internal server error"
      }).status(500).send();
    }

    const songs = youtubeData[0].items;

    if (!songs.length) {
      return res.json({
        message: "Internal server error"
      }).status(500).send();
    }

    await client.set('songs', JSON.stringify(songs), {
      EX: 6 * 60 * 60,
      NX: true
    });

    return res.json({ songs }).status(200).send();
  }

  return res.json({
    message: "Internal server error"
  }).status(500).send();
});

export { VideoRouters };
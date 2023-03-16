import axios from "axios";
import { Request, Response } from "express";
import { AppError } from "../../../errors/AppError";
import Video from "../../../interfaces/Video/Video";

class FetchVideoUseCase {

  async execute(req: Request, res: Response): Promise<Video> {
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
        return response.data;
      } catch (error: any) {
        if (error.response.status === 429) {
          throw new AppError("The daily download limit has been exceeded", 429);
        }

        throw new AppError("Something went wrong with the server", 500);
      }
    } else {
      throw new AppError("Video id missing", 400);
    }
  }

}

export { FetchVideoUseCase };
import { Request, Response } from "express";
import { FetchPopularUseCase } from "./FetchPopularUseCase";

class FetchPopularController {

  async handle(req: Request, res: Response): Promise<Response> {
    const fetchPopularUseCase = new FetchPopularUseCase();
    const songs = await fetchPopularUseCase.execute();

    return res.json(songs);
  }
}

export { FetchPopularController };
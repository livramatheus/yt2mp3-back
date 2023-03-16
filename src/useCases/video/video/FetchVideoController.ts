import { Request, Response } from "express";
import { FetchVideoUseCase } from "./FetchVideoUseCase";

class FetchVideoController {
    
  async handle(req: Request, res: Response): Promise<Response> {
    const fetchVideoUseCase = new FetchVideoUseCase();
    const video = await fetchVideoUseCase.execute(req, res);
    
    return res.json(video);
  }

}

export { FetchVideoController };
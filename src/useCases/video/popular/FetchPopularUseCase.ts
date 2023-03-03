import axios from "axios";
import { AppError } from "../../../errors/AppError";
import { RedisManager } from "../../../infra/RedisManager";

class FetchPopularUseCase {

  async execute(): Promise<any> {
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
      return { songs: shuffled };
    }
  
    const response = await axios.request(requestOptions);
  
    if (response.status === 200) {
      const youtubeData = response.data.items.filter((i: any) => {
        return i.title === "Popular today";
      });
      
      if (!youtubeData[0].items) {
        throw new AppError("Internal server error", 500);
      }
  
      const songs = youtubeData[0].items;
  
      if (!songs.length) {
        throw new AppError("Internal server error", 500);
      }
  
      await client.set('songs', JSON.stringify(songs), {
        EX: 6 * 60 * 60,
        NX: true
      });
      
      return { songs: prepareResponseArray(songs) };
    }
  
    throw new AppError("Internal server error", 500);
  }
}

export { FetchPopularUseCase };
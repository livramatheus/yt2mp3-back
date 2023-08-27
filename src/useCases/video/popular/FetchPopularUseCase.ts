import axios from "axios";
import { AppError } from "../../../errors/AppError";
import { RedisManager } from "../../../infra/RedisManager";
import PopularSongsList from "../../../interfaces/Popular/PopularSongsList";
import PopularSong from "../../../models/PopularSong";

class FetchPopularUseCase {

  async execute(): Promise<PopularSongsList> {
    const requestOptions = {
      method: 'GET',
      url: 'https://simple-youtube-search.p.rapidapi.com/search',
      params: {
        query: 'official+music+video',
        safesearch: 'false'
      },
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
      const songs = response.data.results;
  
      if (!songs.length) {
        throw new AppError("Internal server error", 500);
      }

      const remappedSongs = songs.map((s: any) => {
        return new PopularSong({
          image: s.thumbnail.url,
          title: s.title,
          artist: s.channel.name,
          id: s.id,
        });
      })

      await client.set('songs', JSON.stringify(remappedSongs), {
        EX: 6 * 60 * 60,
        NX: true
      });

      return { songs: prepareResponseArray(remappedSongs) };
    }
  
    throw new AppError("Internal server error", 500);
  }
}

export { FetchPopularUseCase };
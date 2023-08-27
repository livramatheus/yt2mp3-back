interface IPopularSong {
  image: string;
  title: string;
  artist: string;
  id: string;
}

class PopularSong {

  image: string;
  title: string;
  artist: string;
  id: string;
  
  constructor(params: IPopularSong) {
    this.image = params.image
    this.title = params.title
    this.artist = params.artist
    this.id = params.id
  }

}

export default PopularSong;
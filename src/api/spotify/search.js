import { SPOTIFY_API_URL } from 'babel-dotenv';
import Spotify from './spotify';

export default class Search extends Spotify {
  spotifyUrl = SPOTIFY_API_URL;
  segmentUrl = 'search/';
  params = {};
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  async findAlbumByArtist(albumName, artistName) {
    await this.checkClientAuthorization();
    const url = this.spotifyUrl + this.segmentUrl;
    const params = {
      q: `${albumName} ${artistName}`,
      type: 'album'
    };
    const headers = this.headers;

    return this.get(url, params, headers);
  }
}

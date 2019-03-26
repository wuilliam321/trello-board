import Spotify from './spotify';

export default class Search extends Spotify {

  async findAlbumByArtist(query) {
    try {
      await this.checkClientAuthorization();
      const url = this.apiUrl + 'search/';
      const params = {
        q: `${query}`,
        type: 'album'
      };
      const headers = this.headers;

      const response = await this.get(url, params, headers);
      if (response && response.data) {
        return response.data;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

import Spotify from './spotify';
import ErrorHandler from '../../lib/error_handler';

/**
 * Spotify search implementation
 */
export default class Search extends Spotify {

  async findByQueryString(query) {
    let response;
    try {
      await this.checkClientAuthorization();
      const url = this.apiUrl + 'search/';
      const headers = this.headers;
      const params = {
        q: `${query}`,
        type: 'album'
      };

      response = await this.get(url, params, headers);
    } catch (e) {
      ErrorHandler.log(e);
    }

    if (response && response.data) {
      return response.data;
    }
  }
}

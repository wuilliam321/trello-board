import {
  SPOTIFY_API_URL,
  SPOTIFY_ACCOUNTS_API_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET
} from 'babel-dotenv';
import querystring from 'querystring';
import Base from '../base';
import ErrorHandler from '../../lib/error_handler';

/**
 * Spotify abstraction to serve correct API, access_token params, and headers
 */
export default class Spotify extends Base {
  apiUrl = SPOTIFY_API_URL;
  spotifyAccountsUrl = SPOTIFY_ACCOUNTS_API_URL;
  params = {};
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  async checkClientAuthorization() {
    try {
      // TODO: Check if token is alive or request a refresh
      const url = this.spotifyAccountsUrl + 'token';
      const data = {grant_type: 'client_credentials'};
      const stringCredentials = SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET;
      const credentials = Buffer.from(stringCredentials).toString('base64');
      const headers = {
        'Authorization': 'Basic ' + credentials,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      };
      const response = await this.post(url, querystring.encode(data), headers);
      if (response.data && response.data.access_token) {
        this.setToken(response.data.access_token)
      }

      return response.data;
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  setToken(token) {
    this.headers['Authorization'] = 'Bearer ' + token;
  }
}

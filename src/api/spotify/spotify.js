import {
  SPOTIFY_ACCOUNTS_API_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET
} from 'babel-dotenv';
import querystring from 'querystring';
import Base from '../base';

export default class Spotify extends Base {
  spotifyAccountsUrl = SPOTIFY_ACCOUNTS_API_URL;
  params = {};
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  async checkClientAuthorization() {
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
    return response;
  }

  setToken(token) {
    this.headers['Authorization'] = 'Bearer ' + token;
  }
}

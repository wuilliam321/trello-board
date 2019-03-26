import { TRELLO_API_URL, TRELLO_KEY, TRELLO_TOKEN } from 'babel-dotenv';
import Base from '../base';

/**
 * Trello abstraction to serve correct API, key and token params, and headers
 */
export default class Trello extends Base {
  apiUrl = TRELLO_API_URL;
  params = {
    key: TRELLO_KEY,
    token: TRELLO_TOKEN
  };
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

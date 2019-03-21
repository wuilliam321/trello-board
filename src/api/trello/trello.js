import { TRELLO_API_URL, TRELLO_KEY, TRELLO_TOKEN } from 'babel-dotenv';
import Base from '../base';

export default class Trello extends Base {
  trelloUrl = TRELLO_API_URL;
  params = {
    key: TRELLO_KEY,
    token: TRELLO_TOKEN
  };
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

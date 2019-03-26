import axios from 'axios';
import ErrorHandler from '../lib/error_handler';

/**
 * A base abstraction of the possible requests to be made
 */
export default class Base {
  async get(url, params, headers) {
    let response;
    try {
      response = await axios.get(url, { params, headers });
    } catch (e) {
      ErrorHandler.log(e);
    }

    return response;
  }

  async post(url, data, headers, retries = 5) {
    let response;
    try {
      response = await axios.post(url, data, {headers});
    } catch (e) {
      // Retry n times behavior
      if (retries > 0) {
        response = await this.post(url, data, headers,retries - 1);
      }
      ErrorHandler.log(e);
    }

    return response;

  }
}

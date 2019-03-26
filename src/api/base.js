import axios from 'axios';

export default class Base {
  async get(url, params = null, headers = null) {
    try {
      return await axios.get(url, { params, headers });
    } catch (e) {
      console.error(e);
    }
  }

  async post(url, data = null, headers = null, retries = 5) {
    try {
      return await axios.post(url, data, {headers});
    } catch (e) {
      console.log('Error retrying: ' + retries);
      if (retries > 0) {
        console.log('Retry: ' + retries);
        try {
          await this.post(url, data, headers,retries - 1);
        } catch (e) {
          console.error(e);
        }
      }
      console.error(e);
    }

  }

  async put(url, data = null, headers = null) {
    try {
      return await axios.put(url, data, {headers});
    } catch (e) {
      console.error(e);
    }
  }

  async delete(url, headers = null) {
    try {
      return await axios.delete(url, {headers});
    } catch (e) {
      console.error(e);
    }
  }
}

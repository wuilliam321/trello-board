import axios from 'axios';

export default class Base {
  get(url, params = null, headers = null) {
    try {
      return axios.get(url, { params, headers })
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }

  post(url, data = null, headers = null) {
    try {
      return axios.post(url, data, {headers})
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }

  }

  put(url, data = null, headers = null) {
    try {
      return axios.put(url, data, {headers})
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }

  delete(url, headers = null) {
    try {
      return axios.delete(url, {headers})
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }
}

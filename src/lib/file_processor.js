import fs from 'fs';

export default class FileProcessor {
  fileUri = '';

  /**
   * Load file data and convert it into a promise
   * @returns {Promise<any>}
   */
  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.fileUri, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }
}

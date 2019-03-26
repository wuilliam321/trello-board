import fs from 'fs';

export default class FileProcessor {
  fileUri = '';

  async readFile() {
    try {
      const fileData = await this.runFsRead();
      return fileData;
    } catch (e) {
      console.error(e)
    }
  }

  runFsRead() {
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

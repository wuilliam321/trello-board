import FileProcessor from './file_processor';
import {DISCOGRAPHY_SOURCE_FILE} from 'babel-dotenv';

describe('File Processor', () => {
  let fp;
  beforeAll(() => {
    fp = new FileProcessor();
    fp.fileUri = DISCOGRAPHY_SOURCE_FILE;
  });

  describe('when a file is going to be loaded', () => {
    let file;

    beforeEach(async done => {
      file = await fp.readFile();
      done();
    });

    it('should exists', () => {
      expect(file).not.toBe(null);
      expect(file.length).toBeGreaterThan(0);
    });
    
  });
});

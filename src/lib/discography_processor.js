import { DISCOGRAPHY_SOURCE_FILE } from 'babel-dotenv';
import FileProcessor from "./file_processor";
import orderBy from 'lodash/orderBy';

export default class DiscographyProcessor extends FileProcessor {
  constructor() {
    super();
    this.fileUri = DISCOGRAPHY_SOURCE_FILE;
  }

  async processDiscography() {
    const fileData = await this.readFile();
    const albums = this.prepareAlbumsWithYears(fileData);
    this.prepareDecades(albums);
  }

  prepareAlbumsWithYears(fileData) {
    const albums = fileData.toString().split(/\r?\n/);
    const filteredAlbums = albums.filter(album => album !== '');
    return filteredAlbums.map(album => {
      const data = album.split(' ');
      const [year] = data;
      const title = data.slice(1).join(' ');
      return {
        year,
        title
      };
    });
  }

  prepareDecades(albums) {
    albums.map(album => {
      const tensModule = album.year % 100;
      const unitsModule = album.year % 10;
      album.decade = tensModule - unitsModule;
    });

    return orderBy(albums, ['year', 'title'], ['asc', 'asc']);
  }


}

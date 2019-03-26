import { DISCOGRAPHY_SOURCE_FILE } from 'babel-dotenv';
import FileProcessor from './file_processor';
import ErrorHandler from './error_handler';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import mapKeys from 'lodash/mapKeys';
import Boards from '../api/trello/boards';
import Search from '../api/spotify/search';

export default class DiscographyProcessor extends FileProcessor {
  boardsService;
  searchService;
  artistName;
  boardId;
  albums;

  constructor() {
    super();
    this.fileUri = DISCOGRAPHY_SOURCE_FILE;
    this.boardsService = new Boards();
    this.searchService = new Search();
  }

  /**
   * Run the discography file processor in order to load albums to trello
   * gruped by decade and sorted by year/name
   * @param artistName
   * @returns {Promise<void>}
   */
  async processDiscography(artistName = 'John Doe') {
    try {
      this.artistName = artistName;
      let fileData = await this.readFile();
      if (fileData) {
        this.albums = this.initializeAlbumsWithYears(fileData);
        this.setAlbumsDecades();
        await this.createDiscographyBoard();
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  initializeAlbumsWithYears(fileData) {
    const fileAlbums = fileData.toString().split(/\r?\n/);
    const albumsWithTitle = fileAlbums.filter(album => album !== '');
    return albumsWithTitle.map(album => {
      // TODO: It could be a regex
      const data = album.split(' ');
      const [year] = data;
      const title = data.slice(1).join(' ');
      const decade = '';
      return {year, title, decade};
    });
  }

  setAlbumsDecades() {
    this.albums.map(album => (album.decade = album.year - (album.year % 10)));
    this.albums = orderBy(this.albums, ['year', 'title'], ['desc', 'asc']);
    return this.albums;
  }

  async createDiscographyBoard() {
    try {
      const discographyTitle = this.artistName + '’s Discography';
      const boardData = await this.boardsService.createBoard(discographyTitle);

      if (boardData) {
        this.boardId = boardData.id;
        await this.createDecadeList(boardData);
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async createDecadeList(boardData) {
    try {
      const albumsGroupedByDecade = groupBy(this.albums, 'decade');
      let decadePos = 0;
      mapKeys(albumsGroupedByDecade, async (decadeAlbums, decade) => {
        const listData = await this.boardsService.createBoardList(boardData.id, decade, decadePos++);
        if (listData) {
          await this.createDecadeListCards(listData, decadeAlbums)
        }
      });
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async createDecadeListCards(listData, decadeAlbums) {
    try {
      const decadeAlbumsSorted = orderBy(decadeAlbums, ['year', 'title'], ['asc', 'asc']);
      decadeAlbumsSorted.forEach(async (album, cardPos) => {
        const cardTitle = `${album.year} - ${album.title}`;
        const cardData = await this.boardsService.createListCard(listData.id, cardTitle, cardPos);

        if (cardData) {
          await this.tryAddAlbumCover(cardData, album.title);
        }
      });
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async tryAddAlbumCover(cardData, albumTitle) {
    try {
      const albumData = await this.searchService.findByQueryString(albumTitle + ' ' + this.artistName);
      const albumImage = this.getAlbumImageByTitle(albumData, albumTitle);

      if (albumImage) {
        await this.boardsService.addCardAttachments(cardData.id, albumImage.url);
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  getAlbumImageByTitle(albumData, albumTitle) {
    let albumImage;
    if (albumData && albumData.albums && albumData.albums.items) {
      const album = this.findAlbumItemByTitle(albumData, albumTitle);
      albumImage = this.getAlbumImage(album);
    }

    return albumImage;
  }

  findAlbumItemByTitle(albumData, albumTitle) {
    let album = albumData.albums.items.find((item) => item.name === albumTitle);
    if (!album) {
      const [firstAlbum] = albumData.albums.items;
      album = firstAlbum;
    }

    return album;
  }

  getAlbumImage(album) {
    let image;
    const [firstImage] = album.images;
    if (firstImage) {
      image = firstImage;
    }

    return image;
  }

}

import { DISCOGRAPHY_SOURCE_FILE } from 'babel-dotenv';
import FileProcessor from "./file_processor";
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import mapKeys from 'lodash/mapKeys';
import Boards from "../api/trello/boards";
import Search from "../api/spotify/search";

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

  async processDiscography(artistName = 'John Doe') {
    let fileData = await this.getArtistDiscographyFileData(artistName);
    if (fileData) {
      this.albums = this.prepareAlbumsWithYears(fileData);
      this.prepareDecades();
      await this.createTrelloBoard();
    }
  }

  async getArtistDiscographyFileData(artistName) {
    let response;
    try {
      this.artistName = artistName;
      response = await this.readFile();
    } catch (e) {
      console.error(e);
    }

    return response;
  }

  prepareAlbumsWithYears(fileData) {
    const albums = fileData.toString().split(/\r?\n/);
    const filteredAlbums = albums.filter(album => album !== '');
    return filteredAlbums.map(album => {
      const data = album.split(' ');
      const [year] = data;
      const title = data.slice(1).join(' ');
      const decade = '';
      return {
        year,
        title,
        decade
      };
    });
  }

  prepareDecades() {
    this.albums.map(album => {
      album.decade = album.year - (album.year % 10);
    });
    this.albums = orderBy(this.albums, ['year', 'title'], ['desc', 'asc']);
    return this.albums;
  }

  async createTrelloBoard() {
    let boardData;
    const discographyTitle = this.artistName + '’s Discography';
    await this.createBoard(discographyTitle);

    if (boardData && boardData.id) {
      try {
        await this.createBoardList(boardData);
        return boardData;
      } catch (e) {
        console.error(e);
      }
    }
  }

  async createBoard(discographyTitle) {
    let response;
    try {
      response = await this.boardsService.createAlbumsBoard(discographyTitle);
      this.boardId = response.id;
    } catch (e) {
      console.error(e);
    }
  }

  async createBoardList(boardData) {
    const albumsGroupedByDecade = groupBy(this.albums, 'decade');
    if (albumsGroupedByDecade) {
      let decadePos = 0;
      mapKeys(albumsGroupedByDecade, async (decadeAlbums, decade) => {
        let listData;
        try {
          decadePos++;
          listData = await this.boardsService.createBoardList(boardData.id, decade, decadePos);
          // const listData = {id: '33'};
          console.log('  ' + decade);
          if (!listData || !listData.id) {
            // throw 'Error trying to save board list';
          }
        } catch (e) {
          // await this.deleteBoard();
          console.error(e);
        }

        if (listData && listData.id) {
          try {
            await this.createListCard(listData, decadeAlbums);
            return listData;
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }

  async createListCard(listData, decadeAlbums) {
    const decadeAlbumsSorted = orderBy(decadeAlbums, ['year', 'title'], ['asc', 'asc']);
    decadeAlbumsSorted.forEach(async (album, cardPos) => {
      let cardData;
      try {
        const cardTitle = `${album.year} - ${album.title}`;
        cardData = await this.boardsService.createListCard(listData.id, cardTitle, cardPos);
        // const cardData = {id: '33'};
        console.log('    ' + cardTitle);
        if (!cardData || !cardData.id) {
          // throw 'Error trying to save list card';
        }
      } catch (e) {
        // await this.deleteBoard();
        console.error(e);
      }

      if (cardData && cardData.id) {
        try {
          await this.attachCardImage(cardData, album.title, this.artistName);
          return cardData;
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  async attachCardImage(cardData, albumTitle, artistName) {
    let albumData;
    try {
      albumData = await this.searchService.findAlbumByArtist(albumTitle + ' ' + artistName);
    } catch (e) {
      console.error(e);
    }

    const albumImage = this.getAlbumImageByTitle(albumData, albumTitle);
    if (albumImage) {
      try {
        await this.attachImageToCard(cardData.id, albumImage);
      } catch (e) {
        console.error(e);
      }
    }
  }

  getAlbumImageByTitle(albumData, albumTitle) {
    let albumImage;
    if (albumData && albumData.albums) {
      let firstMatch = albumData.albums.items.find((item) => item.name === albumTitle);
      if (!firstMatch) {
        [firstMatch] = albumData.albums.items;
      }

      if (firstMatch) {
        const [firstImage] = firstMatch.images;
        if (firstImage) {
          albumImage = firstImage;
        }
      }
    }

    return albumImage;
  }

  async attachImageToCard(cardId, albumImage) {
    try {
      console.log('      ' + albumImage.url);
      const imageData = await this.boardsService.attachCardImage(cardId, albumImage.url);
      // const imageData = {id: '33'};
      if (!imageData || !imageData.id) {
        // throw 'Cannot attach image to card';
      }

      return imageData;
    } catch (e) {
      console.error(e);
    }
  }

  // async deleteBoard() {
  //   try {
  //     const response = await this.boardsService.deleteBoard(this.boardId);
  //     if (!response) {
  //       // throw 'Error deleting';
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }


}

import Trello from './trello';
import ErrorHandler from '../../lib/error_handler';

/**
 * Trello boards implementation (it could be split to get files for each entity)
 * But leave as is for simplicity
 */
export default class Boards extends Trello {

  async createBoard(title) {
    try {
      const url = this.apiUrl + 'boards/';
      const params = {
        ...{
          name: title,
          defaultLists: false
        },
        ...this.params
      };
      const headers = this.headers;
      const response = await this.post(url, params, headers);
      if (response && response.data) {
        return response.data;
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async createBoardList(boardId, listName, position) {
    try {
      const url = this.apiUrl + 'lists/';
      const params = {
        ...{
          idBoard: boardId,
          name: listName,
          pos: position
        },
        ...this.params
      };
      const headers = this.headers;
      const response = await this.post(url, params, headers);
      if (response && response.data) {
        return response.data;
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async createListCard(listId, cardName, position) {
    try {
      const url = this.apiUrl + 'cards/';
      const params = {
        ...{
          idList: listId,
          name: cardName,
          pos: position
        },
        ...this.params
      };
      const headers = this.headers;
      const response = await this.post(url, params, headers);
      if (response && response.data) {
        return response.data;
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }

  async addCardAttachments(cardId, imageUrl) {
    try {
      const url = this.apiUrl + 'cards/' + cardId + '/attachments';
      const params = {
        ...{
          id: cardId,
          url: imageUrl
        },
        ...this.params
      };
      const headers = this.headers;
      const response = await this.post(url, params, headers);
      if (response && response.data) {
        return response.data;
      }
    } catch (e) {
      ErrorHandler.log(e);
    }
  }
}

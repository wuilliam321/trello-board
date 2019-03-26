import Trello from './trello';

export default class Boards extends Trello {

  async createAlbumsBoard(title) {
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
    }
  }

  async attachCardImage(cardId, imageUrl) {
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
      console.error(e);
    }
  }

  // async deleteBoard(boardId) {
  //   try {
  //     const url = this.apiUrl + 'boards/' + boardId;
  //     const headers = this.headers;
  //     const response = await this.delete(url, headers);
  //     if (response && response.data) {
  //       return response.data;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}

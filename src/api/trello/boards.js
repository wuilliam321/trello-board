import Trello from "./trello";

export default class Boards extends Trello {
  segmentUrl = 'boards/';

  findByBoardId(boardId) {
    const url = this.trelloUrl + this.segmentUrl + boardId;
    const params = {
      ...{
        cards: 'none',
        fields: 'id,name,desc,shortUrl,prefs',
      },
      ...this.params
    };
    const headers = this.headers;
    return this.get(url, params, headers)
  }
}

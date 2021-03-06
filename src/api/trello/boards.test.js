import Boards from './boards';

describe('Boards Service', () => {
  let boardsService;

  beforeAll(() => {
    boardsService = new Boards();
  });

  describe('when creating a board to save albums in there', () => {
    let albumsMock;
    let result;

    beforeAll(async done => {
      albumsMock = [];
      spyOn(boardsService, 'post').and.returnValue({data: {id: '33'}});
      result = await boardsService.createBoard(albumsMock);
      done();
    });

    it('should prepare albums', () => {
      expect(result).not.toBeNull();
      expect(boardsService.post).toHaveBeenCalled();
    })
  });

  describe('when adding lists to the created board', () => {
    let boardId;
    let listNameMock;
    let positionMock;
    let result;
    let expectedResult;

    beforeAll(async done => {
      boardId = '33';
      listNameMock = 'Test';
      positionMock = 0;
      expectedResult = {
        id: '5c9418723a159954b38a06f9',
        name: listNameMock,
        closed: false,
        idBoard: boardId,
        pos: positionMock,
        limits: {}
      };
      spyOn(boardsService, 'post').and.returnValue({data: expectedResult});
      result = await boardsService.createBoardList(boardId, listNameMock, positionMock);
      done();
    });

    it('should create a board list', () => {
      expect(boardsService.post).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result).toBe(expectedResult);
    })
  });

  describe('when adding cards to the created list', () => {
    let listId;
    let cardNameMock;
    let positionMock;
    let result;
    let expectedResult;

    beforeAll(async done => {
      listId = '33';
      cardNameMock = 'Test';
      positionMock = 0;
      expectedResult = {
        id: '5c9418723a159954b38a06f9',
        name: cardNameMock,
        closed: false,
        idList: listId,
        pos: positionMock,
      };
      spyOn(boardsService, 'post').and.returnValue({data: expectedResult});
      result = await boardsService.createListCard(listId, cardNameMock, positionMock);
      done();
    });

    it('should create a list card', () => {
      expect(boardsService.post).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result).toBe(expectedResult);
    })
  });

  describe('when add card attachments to card', () => {
    let cardId;
    let imageUrlMock;
    let result;
    let expectedResult;

    beforeAll(async done => {
      cardId = '33';
      imageUrlMock = 'http://';
      expectedResult = {
        id: '5c9418723a159954b38a06f9'
      };
      spyOn(boardsService, 'post').and.returnValue({data: expectedResult});
      result = await boardsService.addCardAttachments(cardId, imageUrlMock);
      done();
    });

    it('should add an attachment', () => {
      expect(boardsService.post).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result).toBe(expectedResult);
    })
  });
});

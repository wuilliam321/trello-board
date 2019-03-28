import DiscographyProcessor from './discography_processor';

describe('Discography Processor', () => {
  let dp;

  beforeAll(() => {
    dp = new DiscographyProcessor();
    dp.artistName = 'Test Artist';
  });

  describe('when processing discography', () => {
    let albumsMock;
    beforeAll(async done => {
      albumsMock = [
        {
          title: 'Test',
          year: 1990,
          decade: '80',
        }
      ];
      dp.albums = albumsMock;
      spyOn(dp, 'readFile').and.returnValue(['test', 'test']);
      spyOn(dp, 'initializeAlbumsWithYears').and.returnValue(albumsMock);
      spyOn(dp, 'setAlbumsDecades');
      spyOn(dp, 'createDiscographyBoard');

      await dp.processDiscography();
      done();
    });

    it('should prepare albums', () => {
      expect(dp.readFile).toBeCalled();
      expect(dp.initializeAlbumsWithYears).toBeCalled();
      expect(dp.setAlbumsDecades).toBeCalled();
      expect(dp.createDiscographyBoard).toBeCalled();
    });

  });

  describe('when preparing albums with years', () => {
    let result;
    let expectedResult;
    let fileData;

    beforeAll(async done => {
      fileData = await dp.readFile();
      expectedResult = fileData.toString().split(/\r?\n/);
      result = dp.initializeAlbumsWithYears(fileData);
      done();
    });

    it('should return a list of albums', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(expectedResult.length - 1);
    });

  });

  describe('when preparing decades', () => {
    let result;
    let expectedResult;
    let sampleAlbum;
    let albumsMock;

    beforeAll(() => {
      albumsMock = [
        {
          title: 'Test',
          year: 1990,
          decade: '80',
        }
      ];
      spyOn(dp, 'initializeAlbumsWithYears').and.returnValue(albumsMock);
      expectedResult = albumsMock.length;
      result = dp.setAlbumsDecades(albumsMock);
      [sampleAlbum] = result;
    });

    it('should return a list of decades', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(expectedResult);
      expect(sampleAlbum).toHaveProperty('title');
      expect(sampleAlbum).toHaveProperty('year');
      expect(sampleAlbum).toHaveProperty('decade');
    });

  });

  describe('when create trello board', () => {
    let result;
    beforeAll(async done => {
      spyOn(dp.boardsService, 'createBoard').and.returnValue({id: '33'});
      spyOn(dp, 'createDecadeList');
      result = await dp.createDiscographyBoard();
      done();
    });

    it('should create the board', () => {
      expect(dp.boardsService.createBoard).toBeCalled();
      expect(dp.createDecadeList).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when create board list', () => {
    let result;
    let boardDataMock;
    let albumsMock;
    beforeAll(async done => {
      boardDataMock = {id: '33'};
      albumsMock = albumsMock = [
        {
          title: 'Test',
          year: '1990',
          decade: '1980',
        }
      ];
      dp.albums = albumsMock;
      spyOn(dp.boardsService, 'createBoardList').and.returnValue(boardDataMock);
      spyOn(dp, 'createDecadeListCards');
      result = await dp.createDecadeList(boardDataMock);
      done();
    });

    it('should create the board list', () => {
      expect(dp.boardsService.createBoardList).toBeCalled();
      expect(dp.createDecadeListCards).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when create list card', () => {
    let result;
    let listDataMock;
    let albumDecadesMock;
    beforeAll(async done => {
      listDataMock = {id: 33};
      albumDecadesMock = [
        {
          title: 'Test',
          year: '1990',
          decade: '1990',
        }
      ];
      spyOn(dp.boardsService, 'createListCard').and.returnValue({id: '33'});
      spyOn(dp, 'tryAddAlbumCover');
      result = await dp.createDecadeListCards(listDataMock, albumDecadesMock);
      done();
    });

    it('should create the list', () => {
      expect(dp.boardsService.createListCard).toBeCalled();
      expect(dp.tryAddAlbumCover).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when attach card image', () => {
    let cardDataMock;
    let spotifyArtistMock;
    let result;
    beforeAll(async done => {
      cardDataMock = {id: '33'};
      spotifyArtistMock = {
        albums: {
          items: [
            {
              images: [
                {
                  url: 'http://test'
                }
              ]
            }
          ]
        }

      };
      spyOn(dp.boardsService, 'addCardAttachments').and.returnValue({id: '33'});
      spyOn(dp.searchService, 'findByQueryString').and.returnValue(spotifyArtistMock);
      result = await dp.tryAddAlbumCover(cardDataMock, 'Query Title');
      done();
    });

    it('should attach the image', () => {
      expect(dp.boardsService.addCardAttachments).toBeCalled();
      expect(result).not.toBeNull();
    });

  });
});

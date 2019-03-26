import DiscographyProcessor from './discography_processor';

describe('Discography Processor', () => {
  let dp;

  beforeAll(() => {
    dp = new DiscographyProcessor();
    dp.artistName = 'Test Artist';
  });

  describe('when processing discography', () => {
    let albumsMock;
    beforeAll(() => {
      albumsMock = [
        {
          title: 'Test',
          year: 1990,
          decade: '80',
        }
      ];
      dp.albums = albumsMock;
      spyOn(dp, 'getArtistDiscographyFileData').and.returnValue(['test', 'test']);
      spyOn(dp, 'prepareAlbumsWithYears').and.returnValue(albumsMock);
      spyOn(dp, 'prepareDecades');
      spyOn(dp, 'createTrelloBoard');

      dp.processDiscography();
    });

    it('should prepare albums', () => {
      expect(dp.getArtistDiscographyFileData).toBeCalled();
      expect(dp.prepareAlbumsWithYears).toBeCalled();
      expect(dp.prepareDecades).toBeCalled();
      expect(dp.createTrelloBoard).toBeCalled();
    });

  });

  describe('when preparing albums with years', () => {
    let result;
    let expectedResult;
    let fileData;

    beforeAll(async () => {
      fileData = await dp.readFile();
      expectedResult = fileData.toString().split(/\r?\n/);
      result = dp.prepareAlbumsWithYears(fileData);
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
      spyOn(dp, 'prepareAlbumsWithYears').and.returnValue(albumsMock);
      expectedResult = albumsMock.length;
      result = dp.prepareDecades(albumsMock);
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
    beforeAll(async () => {
      spyOn(dp.boardsService, 'createAlbumsBoard').and.returnValue({id: '33'});
      spyOn(dp, 'createBoardList');
      result = await dp.createTrelloBoard();
    });

    it('should create the board', () => {
      expect(dp.boardsService.createAlbumsBoard).toBeCalled();
      expect(dp.createBoardList).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when create board list', () => {
    let result;
    let boardDataMock;
    let albumsMock;
    beforeAll(async () => {
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
      // spyOn(dp, 'createListCard');
      result = await dp.createBoardList(boardDataMock);
    });

    it('should create the board list', () => {
      expect(dp.boardsService.createBoardList).toBeCalled();
      // expect(dp.createListCard).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when create list card', () => {
    let result;
    let listDataMock;
    let albumDecadesMock;
    beforeAll(async () => {
      listDataMock = {id: 33};
      albumDecadesMock = [
        {
          title: 'Test',
          year: '1990',
          decade: '1990',
        }
      ];
      spyOn(dp.boardsService, 'createListCard').and.returnValue({id: '33'});
      spyOn(dp, 'attachCardImage');
      result = await dp.createListCard(listDataMock, albumDecadesMock);
    });

    it('should create the list', () => {
      expect(dp.boardsService.createListCard).toBeCalled();
      expect(dp.attachCardImage).toBeCalled();
      expect(result).not.toBeNull();
    });

  });

  describe('when attach card image', () => {
    let cardDataMock;
    let spotifyArtistMock;
    let result;
    beforeAll(async() => {
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
      spyOn(dp.boardsService, 'attachCardImage').and.returnValue({id: '33'});
      spyOn(dp.searchService, 'findAlbumByArtist').and.returnValue(spotifyArtistMock);
      result = await dp.attachCardImage(cardDataMock, 'Query Title');
    });

    it('should attach the image', () => {
      expect(dp.boardsService.attachCardImage).toBeCalled();
      expect(result).not.toBeNull();
    });

  });
});

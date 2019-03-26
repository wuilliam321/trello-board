import Search from './search';
import ErrorHandler from "../../lib/error_handler";

describe('Search Service', () => {
  let searchService;

  beforeAll(() => {
    searchService = new Search();
  });

  describe('when get album by artist called', () => {
    let queryMock;
    let authorizationCheckerSpy;
    let requestSpy;
    let errorHandlerSpy;

    beforeAll(() => {
      queryMock = 'New Album John Doe';
      requestSpy = spyOn(searchService, 'get');
      authorizationCheckerSpy = spyOn(searchService, 'checkClientAuthorization');
      errorHandlerSpy = spyOn(ErrorHandler, 'log');
    });

    describe('On Success', () => {
      let result;

      beforeAll(async () => {
        requestSpy.and.returnValue({id: '33'});
        result = await searchService.findByQueryString(queryMock);
      });

      it('should return an album by the given artist', () => {
        expect(searchService.checkClientAuthorization).toBeCalled();
        expect(searchService.get).toBeCalled();
        expect(result).not.toBeNull();
      })
    });

    describe('On Error', () => {
      let errorMock;
      let result;

      beforeAll(async () => {
        errorMock = 'Custom Error';
        requestSpy.and.throwError(errorMock);
        result = await searchService.findByQueryString(queryMock)
      });

      it('should return an error', () => {
        expect(searchService.checkClientAuthorization).toBeCalled();
        expect(searchService.get).toBeCalled();
        expect(ErrorHandler.log).toBeCalled();
        expect(result).toBeUndefined();
      })
    });
  });
});

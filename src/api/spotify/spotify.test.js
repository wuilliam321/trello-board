import Spotify from './spotify';
import ErrorHandler from "../../lib/error_handler";

describe('Spotify Service', () => {
  let spotifyService;

  beforeAll(() => {
    spotifyService = new Spotify();
  });

  describe('when check client authentication called', () => {
    let requestSpy;
    let errorHandlerSpy;

    beforeAll(() => {
      requestSpy = spyOn(spotifyService, 'post');
      errorHandlerSpy = spyOn(ErrorHandler, 'log');
      spyOn(spotifyService, 'setToken');
    });

    describe('On Success', () => {
      let result;
      let tokenMock;

      beforeAll(async () => {
        tokenMock = '123321';
        requestSpy.and.returnValue({data: {access_token: tokenMock}});
        result = await spotifyService.checkClientAuthorization();
      });

      it('should perform the validation', () => {
        expect(spotifyService.post).toBeCalled();
        expect(spotifyService.setToken).toBeCalledWith(tokenMock);
        expect(result).not.toBeNull();
      })
    });

    describe('On Error', () => {
      let errorMock;
      let result;

      beforeAll(async () => {
        errorMock = 'Custom Error';
        requestSpy.and.throwError(errorMock);
        result = await spotifyService.checkClientAuthorization();
      });

      it('should return an error', () => {
        expect(spotifyService.post).toBeCalled();
        expect(ErrorHandler.log).toBeCalled();
        expect(result).toBeUndefined();
      })
    });
  });
});

import axios from 'axios';
import Base from './base';
import ErrorHandler from '../lib/error_handler';

describe('Base Test', () => {
  let base;
  let httpLibrary;
  beforeAll(() => {
    base = new Base();
    httpLibrary = axios;
  });
  
  describe('GET Called', () => {
    let requestSpy;
    let errorHandlerSpy;

    beforeAll(() => {
      requestSpy = spyOn(httpLibrary, 'get');
      errorHandlerSpy = spyOn(ErrorHandler, 'log');
    });

    describe('On success', () => {
      beforeEach(() => {
        base.get('http://', null, null);
      });
      
      it('should call library get method', () => {
        expect(httpLibrary.get).toHaveBeenCalled();
      });
    });

    describe('On error', () => {
      let errorMock;

      beforeEach(() => {
        errorMock = 'Custom error';
        requestSpy.and.throwError(errorMock);
        base.get('http://', null, null);
      });

      it('should call library get method', () => {
        expect(httpLibrary.get).toHaveBeenCalled();
      });

      it('should call error handler log', () => {
        expect(ErrorHandler.log).toHaveBeenCalled();
      });
    })
  });
  
  describe('POST Called', () => {
    let requestSpy;
    let errorHandlerSpy;

    beforeAll(() => {
      requestSpy = spyOn(httpLibrary, 'post');
      errorHandlerSpy = spyOn(ErrorHandler, 'log');
    });

    describe('On success', () => {
      beforeEach(() => {
        base.post('http://', null, null, 0);
      });
      
      it('should call library post method', () => {
        expect(httpLibrary.post).toHaveBeenCalled();
      });
    });

    describe('On error', () => {
      let errorMock;

      beforeEach(() => {
        errorMock = 'Custom error';
        requestSpy.and.throwError(errorMock);
        base.post('http://', null, null);
      });

      it('should call library post method', () => {
        expect(httpLibrary.post).toHaveBeenCalled();
      });

      it('should call error handler log', () => {
        expect(ErrorHandler.log).toHaveBeenCalled();
      });
    })
  });
  
});

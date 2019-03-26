import ErrorHandler from './error_handler';

describe('Error Handler', () => {
  describe('When log called', () => {
    const expectResult = 'logged!';

    beforeAll(() => {
      console.error = jest.fn();
    });

    beforeEach(() => {
      ErrorHandler.log(expectResult);
    });

    it('should log the error', () => {
      expect(console.error.mock.calls[0][0]).toBe(expectResult);
    });

  });
});

import Trello from './trello';

describe('Trello Service', () => {
  let trelloService;

  beforeAll(() => {
    trelloService = new Trello();
  });

  describe('check initial values', () => {

    it('should have api url', () => {
      expect(trelloService.apiUrl).not.toBeNull();
    });

    it('should env params be present', () => {
      expect(trelloService.params).not.toBeNull();
      expect(trelloService.params.key).not.toBeNull();
      expect(trelloService.params.token).not.toBeNull();
    });

    it('should headers be present', () => {
      expect(trelloService.headers).not.toBeNull();
    });
  });

});

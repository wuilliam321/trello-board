import DiscographyProcessor from "./discography_processor";

describe.only('Discography Processor', () => {
  let dp;
  let fileData;
  beforeAll(async () => {
    dp = new DiscographyProcessor();
    fileData = await dp.readFile();
  });

  describe('when processing discography', () => {

    beforeAll(() => {
      spyOn(dp, 'readFile').and.returnValue(fileData);
      spyOn(dp, 'prepareAlbumsWithYears');
      spyOn(dp, 'prepareDecades');
      dp.processDiscography();
    });

    test('It should prepare albums', () => {
      expect(dp.readFile).toBeCalled();
      expect(dp.prepareAlbumsWithYears).toBeCalledWith(fileData);
      expect(dp.prepareDecades).toBeCalled();
    });

  });

  describe('when preparing albums with years', () => {
    let result;
    let expectedResult;

    beforeAll(() => {
      expectedResult = fileData.toString().split(/\r?\n/);
      result = dp.prepareAlbumsWithYears(fileData);
    });

    test('It should return a list of albums', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(expectedResult.length - 1);
    });

  });

  describe('when preparing decades', () => {
    let result;
    let expectedResult;

    beforeAll(() => {
      const albums = dp.prepareAlbumsWithYears(fileData);
      expectedResult = albums.length;
      result = dp.prepareDecades(albums);
    });

    test('It should return a list of decades', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(expectedResult);
    });

  });
});

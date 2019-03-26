export default class ErrorHandler {
  static log(message, ...optionalParams) {
    console.error(message, optionalParams);
  }
}

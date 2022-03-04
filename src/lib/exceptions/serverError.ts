/**
 * Twitter のバックエンドなどでエラーが発生した場合の例外クラス
 */
export class ServerErrorException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}

/**
 * 認証でコケた場合の例外クラス
 */
export class UnauthorizedException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}

/**
 * ツイートが重複した場合の例外クラス
 */
export class DuplicatedException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}

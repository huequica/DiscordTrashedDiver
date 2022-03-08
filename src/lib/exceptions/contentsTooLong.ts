/**
 * 受け取ったものが140字を超えている場合に投げられる例外
 */
export class ContentsTooLongException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}

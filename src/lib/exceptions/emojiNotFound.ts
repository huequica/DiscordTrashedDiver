/**
 * 探した Emoji が存在しなかったときに投げられるエラー
 */
export class EmojiNotFoundError extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}

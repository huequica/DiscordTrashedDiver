/**
 * ネットワーク上の疎通に失敗した場合の例外クラス
 */
export class NetworkHandshakeException extends Error {
  constructor(...args: Parameters<typeof Error>) {
    super(...args);
  }
}
